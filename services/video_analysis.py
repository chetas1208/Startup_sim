"""Video analysis service: find competitor YouTube videos via Tavily Research, analyze with Modulate emotion detection."""
import asyncio
import re
import shutil
import tempfile
from pathlib import Path
from typing import Any, Dict, List, Optional

from pydantic import BaseModel

from services.integrations.modulate_client import get_modulate_client
from services.integrations.reka_client import get_reka_client
from services.integrations.tavily_client import get_tavily_client


# --- Result models ---


class UtteranceWithEmotion(BaseModel):
    """Single utterance with emotion from Modulate Velma-2."""

    text: str
    start_ms: int = 0
    duration_ms: int = 0
    speaker: Optional[int] = None
    language: Optional[str] = None
    emotion: Optional[str] = None
    accent: Optional[str] = None


class VideoEmotionResult(BaseModel):
    """Per-video analysis: transcript, emotion per utterance, and Reka metadata."""

    url: str
    title: str
    transcript: str = ""
    duration_ms: int = 0
    utterances: List[UtteranceWithEmotion] = []
    # Reka metadata (quicktag): https://docs.reka.ai/vision/metadata-tagging
    expected_ctr: Optional[float] = None
    virality_score: Optional[float] = None
    mood_tone: Optional[List[str]] = None
    error: Optional[str] = None


class VideoAnalysisResult(BaseModel):
    """Aggregate result of competitor video analysis."""

    videos: List[VideoEmotionResult] = []
    message: str = ""


# --- YouTube URL helpers ---

YOUTUBE_URL_PATTERNS = (
    r"https?://(?:www\.)?youtube\.com/watch\?v=([a-zA-Z0-9_-]+)",
    r"https?://youtu\.be/([a-zA-Z0-9_-]+)",
)


def _is_youtube_url(url: str) -> bool:
    for pattern in YOUTUBE_URL_PATTERNS:
        if re.search(pattern, url or ""):
            return True
    return False


def _normalize_youtube_id(url: str) -> Optional[str]:
    for pattern in YOUTUBE_URL_PATTERNS:
        m = re.search(pattern, url or "")
        if m:
            return m.group(1)
    return None


def _dedupe_youtube_sources(sources: List[Dict[str, Any]], max_count: int) -> List[Dict[str, Any]]:
    """Filter to YouTube URLs and deduplicate by video ID, up to max_count."""
    seen_ids: set = set()
    out: List[Dict[str, Any]] = []
    for s in sources:
        url = (s.get("url") or "").strip()
        if not _is_youtube_url(url):
            continue
        vid = _normalize_youtube_id(url)
        if vid and vid not in seen_ids:
            seen_ids.add(vid)
            out.append(s)
            if len(out) >= max_count:
                break
    return out


# --- YouTube download (yt-dlp) ---

MAX_VIDEO_DURATION_SECONDS = 600  # 10 min to stay within Modulate 100MB and cost


def _download_youtube_video(youtube_url: str) -> Optional[Path]:
    """
    Download video from a YouTube URL to a temp file (MP4 or WebM).
    Used for both Reka (file upload) and Modulate (accepts MP4/MOV/WebM).
    Skips videos longer than MAX_VIDEO_DURATION_SECONDS.
    Returns path to temp file or None on failure.
    """
    try:
        import yt_dlp
    except ImportError:
        print("video_analysis: yt-dlp not installed, cannot download YouTube video")
        return None

    if not _is_youtube_url(youtube_url):
        return None

    out_dir = Path(tempfile.mkdtemp())
    out_tmpl = str(out_dir / "%(id)s.%(ext)s")
    # Prefer single-file video (no merge); limit height to keep size under 100MB
    # Format order: mp4 or webm up to 720p, then any best (avoids bestvideo+bestaudio merge when ffmpeg missing)
    ydl_opts = {
        "format": "best[height<=720][ext=mp4]/best[height<=720][ext=webm]/best[ext=mp4]/best[ext=webm]/best[height<=720]/best",
        "outtmpl": out_tmpl,
        "quiet": True,
        "no_warnings": True,
        "match_filter": yt_dlp.utils.match_filter_func(
            f"duration < {MAX_VIDEO_DURATION_SECONDS + 1}"
        ),
    }
    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            ydl.download([youtube_url])
        files = list(out_dir.glob("*.mp4")) or list(out_dir.glob("*.webm")) or list(out_dir.glob("*.*"))
        if files:
            return files[0]
        return None
    except Exception as e:
        print(f"video_analysis: yt-dlp download error for {youtube_url}: {e}")
        return None


def _download_youtube_audio(youtube_url: str) -> Optional[Path]:
    """
    Download audio only (for Modulate fallback when video download fails).
    Returns path to m4a/webm/mp3 or None.
    """
    try:
        import yt_dlp
    except ImportError:
        return None
    if not _is_youtube_url(youtube_url):
        return None
    out_dir = Path(tempfile.mkdtemp())
    out_tmpl = str(out_dir / "%(id)s.%(ext)s")
    ydl_opts = {
        "format": "bestaudio[ext=m4a]/bestaudio[ext=webm]/bestaudio/best",
        "outtmpl": out_tmpl,
        "quiet": True,
        "no_warnings": True,
        "match_filter": yt_dlp.utils.match_filter_func(
            f"duration < {MAX_VIDEO_DURATION_SECONDS + 1}"
        ),
    }
    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            ydl.download([youtube_url])
        files = list(out_dir.glob("*.m4a")) or list(out_dir.glob("*.webm")) or list(out_dir.glob("*.mp3")) or list(out_dir.glob("*.*"))
        return files[0] if files else None
    except Exception as e:
        print(f"video_analysis: yt-dlp audio fallback error for {youtube_url}: {e}")
        return None


# --- Main service ---


async def analyze_competitor_videos(
    startup_prompt: str,
    max_videos: int = 3,
    research_max_wait_seconds: float = 300.0,
) -> VideoAnalysisResult:
    """
    Find YouTube videos about competitors of the startup (via Tavily Research),
    then transcribe and run emotion detection (Modulate Velma-2) and get
    ExpectedCTR, ViralityScore, MoodTone (Reka quicktag) for each.
    """
    tavily = get_tavily_client()
    modulate = get_modulate_client()
    reka = get_reka_client()

    research_input = (
        f"Find YouTube videos about competitors and alternative solutions for: {startup_prompt}. "
        "Prefer product reviews, comparisons, or interviews."
    )

    # 1) Tavily Research
    try:
        research_result = await tavily.research(
            input_query=research_input,
            model="mini",
            max_wait_seconds=research_max_wait_seconds,
        )
    except Exception as e:
        print(f"video_analysis: Tavily research error: {e}")
        return VideoAnalysisResult(
            videos=[],
            message="Research failed; no videos analyzed.",
        )

    status = research_result.get("status")
    sources = research_result.get("sources") or []
    if status != "completed":
        return VideoAnalysisResult(
            videos=[],
            message=f"Research did not complete (status={status}); no videos analyzed.",
        )

    # 2) Collect YouTube URLs from sources
    youtube_sources = _dedupe_youtube_sources(sources, max_videos)
    if not youtube_sources:
        return VideoAnalysisResult(
            videos=[],
            message="No YouTube videos found in research sources.",
        )

    def _parse_reka_tags(tag_resp: Optional[Dict[str, Any]]) -> tuple[Optional[float], Optional[float], Optional[List[str]]]:
        expected_ctr, virality_score, mood_tone = None, None, None
        if not tag_resp:
            return expected_ctr, virality_score, mood_tone
        expected_ctr = tag_resp.get("ExpectedCTR")
        if expected_ctr is not None and not isinstance(expected_ctr, (int, float)):
            expected_ctr = None
        virality_score = tag_resp.get("ViralityScore")
        if virality_score is not None and not isinstance(virality_score, (int, float)):
            virality_score = None
        mt = tag_resp.get("MoodTone")
        mood_tone = mt if isinstance(mt, list) else ([mt] if mt is not None else None)
        return expected_ctr, virality_score, mood_tone

    # 3) For each URL: download video -> Reka (file) + Modulate (same file) -> build result
    results: List[VideoEmotionResult] = []
    loop = asyncio.get_event_loop()
    for src in youtube_sources:
        url = (src.get("url") or "").strip()
        title = (src.get("title") or "Unknown").strip() or "Unknown"

        # Download video first (for Reka + Modulate); fallback to audio-only (Modulate only)
        media_path = await loop.run_in_executor(None, _download_youtube_video, url)
        if not media_path:
            media_path = await loop.run_in_executor(None, _download_youtube_audio, url)
        if not media_path:
            results.append(
                VideoEmotionResult(url=url, title=title, error="Failed to download video or audio")
            )
            continue

        # Reka quicktag with file only when we have a video file (Reka expects video)
        reka_tags: Optional[Dict[str, Any]] = None
        is_video = media_path.suffix.lower() in (".mp4", ".webm", ".mov", ".mkv")
        if reka.is_enabled() and is_video:
            try:
                reka_tags = await reka.quicktag_with_file(media_path)
            except Exception as e:
                print(f"video_analysis: Reka quicktag (file) error for {url}: {e}")
        expected_ctr, virality_score, mood_tone = _parse_reka_tags(reka_tags)

        # Modulate transcription + emotion (accepts MP4/WebM/M4A/etc.)
        try:
            mod_response = await modulate.transcribe_batch_with_emotion(
                str(media_path),
                filename=media_path.name,
            )
        except Exception as e:
            results.append(
                VideoEmotionResult(
                    url=url,
                    title=title,
                    error=f"Transcription error: {e}",
                    expected_ctr=expected_ctr,
                    virality_score=virality_score,
                    mood_tone=mood_tone,
                )
            )
            try:
                if media_path.parent.exists():
                    shutil.rmtree(media_path.parent, ignore_errors=True)
            except OSError:
                pass
            continue

        utterances = []
        for u in mod_response.get("utterances") or []:
            utterances.append(
                UtteranceWithEmotion(
                    text=u.get("text", ""),
                    start_ms=u.get("start_ms", 0),
                    duration_ms=u.get("duration_ms", 0),
                    speaker=u.get("speaker"),
                    language=u.get("language"),
                    emotion=u.get("emotion"),
                    accent=u.get("accent"),
                )
            )

        results.append(
            VideoEmotionResult(
                url=url,
                title=title,
                transcript=mod_response.get("text", ""),
                duration_ms=mod_response.get("duration_ms", 0),
                utterances=utterances,
                expected_ctr=expected_ctr,
                virality_score=virality_score,
                mood_tone=mood_tone,
            )
        )

        try:
            if media_path.parent.exists():
                shutil.rmtree(media_path.parent, ignore_errors=True)
        except OSError:
            pass

    return VideoAnalysisResult(
        videos=results,
        message=f"Analyzed {len(results)} video(s)." if results else "No videos could be analyzed.",
    )
