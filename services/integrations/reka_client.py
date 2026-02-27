"""Reka Vision API client (optional).

See: https://docs.reka.ai/vision/
"""
from pathlib import Path
from typing import Optional, Dict, Any, List, Union

import httpx

from config import settings


class RekaClient:
    """Reka Vision API client for video processing and Q&A."""

    def __init__(self):
        self.api_key = settings.reka_api_key
        self.base_url = "https://vision-agent.api.reka.ai"

    def is_enabled(self) -> bool:
        """Check if Reka Vision is configured."""
        return bool(self.api_key)

    def _headers(self) -> Dict[str, str]:
        """Request headers with API key (X-Api-Key per Reka docs)."""
        return {
            "X-Api-Key": self.api_key,
            "Content-Type": "application/json",
        }

    async def health_check(self) -> Dict[str, Any]:
        """Verify Vision API availability. GET /health."""
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.get(f"{self.base_url}/health")
                response.raise_for_status()
                return response.json() if response.content else {}
        except Exception as e:
            print(f"Reka health check error: {e}")
            return {"ok": False, "error": str(e)}

    async def list_videos(self, ids: Optional[List[str]] = None) -> Optional[Dict[str, Any]]:
        """List videos (or by IDs). GET /v1/videos."""
        if not self.is_enabled():
            return None
        try:
            params = {}
            if ids:
                params["ids"] = ids
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.get(
                    f"{self.base_url}/v1/videos",
                    headers=self._headers(),
                    params=params,
                )
                response.raise_for_status()
                return response.json()
        except Exception as e:
            print(f"Reka list_videos error: {e}")
            return None

    async def video_qa_chat(
        self,
        video_id: str,
        messages: Optional[List[Dict[str, str]]] = None,
        stream: bool = False,
        **kwargs: Any,
    ) -> Optional[Dict[str, Any]]:
        """Chat with the video QA model. POST /v1/qa/chat."""
        if not self.is_enabled():
            return None
        try:
            payload: Dict[str, Any] = {"video_id": video_id, "stream": stream}
            if messages is not None:
                payload["messages"] = messages
            for k, v in kwargs.items():
                if v is not None and k in (
                    "user_id",
                    "apply_temporal_prefiltering",
                    "include_demo_videos",
                    "use_map_reduce_summarization",
                ):
                    payload[k] = v
            async with httpx.AsyncClient(timeout=60.0) as client:
                response = await client.post(
                    f"{self.base_url}/v1/qa/chat",
                    headers=self._headers(),
                    json=payload,
                )
                response.raise_for_status()
                return response.json()
        except Exception as e:
            print(f"Reka video_qa_chat error: {e}")
            return None

    async def quicktag(self, video_url: str) -> Optional[Dict[str, Any]]:
        """
        Quick metadata tagging by video URL. Returns tags including ExpectedCTR,
        ViralityScore, MoodTone. See https://docs.reka.ai/vision/metadata-tagging
        """
        if not self.is_enabled():
            return None
        try:
            async with httpx.AsyncClient(timeout=120.0) as client:
                response = await client.post(
                    f"{self.base_url}/v1/qa/quicktag",
                    headers={"X-Api-Key": self.api_key},
                    data={"video_url": video_url},
                )
                response.raise_for_status()
                return response.json()
        except Exception as e:
            print(f"Reka quicktag error: {e}")
            return None

    async def quicktag_with_file(self, video_path: Union[str, Path]) -> Optional[Dict[str, Any]]:
        """
        Quick metadata tagging by uploading a video file. Returns tags including
        ExpectedCTR, ViralityScore, MoodTone. See https://docs.reka.ai/vision/metadata-tagging
        """
        if not self.is_enabled():
            return None
        path = Path(video_path)
        if not path.exists():
            print(f"Reka quicktag: file not found {path}")
            return None
        content_type = "video/webm" if path.suffix.lower() == ".webm" else "video/mp4"
        try:
            with open(path, "rb") as f:
                async with httpx.AsyncClient(timeout=120.0) as client:
                    response = await client.post(
                        f"{self.base_url}/v1/qa/quicktag",
                        headers={"X-Api-Key": self.api_key},
                        files={"video": (path.name, f, content_type)},
                    )
                    response.raise_for_status()
                    return response.json()
        except Exception as e:
            print(f"Reka quicktag (file) error: {e}")
            return None

    async def upload_video_by_url(
        self,
        video_url: str,
        video_name: Optional[str] = None,
        index: bool = True,
        **kwargs: Any,
    ) -> Optional[Dict[str, Any]]:
        """Upload a video by URL. POST /v1/videos/upload (form: video_url)."""
        if not self.is_enabled():
            return None
        try:
            data: Dict[str, Any] = {"video_url": video_url, "index": index}
            if video_name:
                data["video_name"] = video_name
            for k, v in kwargs.items():
                if v is not None and k in (
                    "enable_thumbnails",
                    "video_absolute_start_timestamp",
                    "config",
                    "person_indexing",
                    "persist_frames",
                    "caption_prompt",
                    "encode_chunks",
                    "caption_mode",
                    "group_id",
                    "chunking_config",
                ):
                    data[k] = v
            async with httpx.AsyncClient(timeout=120.0) as client:
                response = await client.post(
                    f"{self.base_url}/v1/videos/upload",
                    headers={"X-Api-Key": self.api_key},
                    data=data,
                )
                response.raise_for_status()
                return response.json()
        except Exception as e:
            print(f"Reka upload_video_by_url error: {e}")
            return None


def get_reka_client() -> RekaClient:
    """Get Reka Vision client instance."""
    return RekaClient()
