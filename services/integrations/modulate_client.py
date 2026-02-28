"""Modulate content moderation client (optional)."""
import io
from pathlib import Path
from typing import Any, Dict, Union

import httpx

from config import settings

VELMA2_BATCH_URL = "https://modulate-developer-apis.com/api/velma-2-stt-batch"


class ModulateClient:
    """Modulate API client for content safety and Velma-2 transcription."""
    
    def __init__(self):
        self.api_key = settings.modulate_api_key
        self.base_url = "https://api.modulate.ai/v1"
    
    def is_enabled(self) -> bool:
        """Check if Modulate is configured."""
        return bool(self.api_key)
    
    async def moderate_content(self, content: str) -> Dict[str, Any]:
        """Moderate content for safety issues."""
        if not self.is_enabled():
            return {"safe": True, "flagged": False, "categories": []}
        
        try:
            async with httpx.AsyncClient(timeout=15.0) as client:
                response = await client.post(
                    f"{self.base_url}/moderate",
                    headers={"Authorization": f"Bearer {self.api_key}"},
                    json={"text": content},
                )
                response.raise_for_status()
                return response.json()
        except Exception as e:
            print(f"Modulate moderation error: {e}")
            return {"safe": True, "flagged": False, "categories": []}
    
    async def revise_if_unsafe(self, content: str, context: str = "") -> str:
        """Check content and revise if flagged."""
        result = await self.moderate_content(content)
        
        if result.get("flagged", False):
            print(f"Content flagged: {result.get('categories', [])}")
            # In production, use LLM to revise
            # For now, add disclaimer
            return f"[Content revised for safety] {content}"
        
        return content

    async def transcribe_batch_with_emotion(
        self,
        audio_path_or_bytes: Union[str, Path, bytes],
        filename: str = "audio.mp3",
    ) -> Dict[str, Any]:
        """
        Transcribe audio via Modulate Velma-2 batch API with emotion detection.
        Returns dict with 'text', 'duration_ms', 'utterances' (each with 'text', 'emotion', etc.).
        Returns safe default when API key is missing or on error.
        """
        default = {"text": "", "duration_ms": 0, "utterances": []}
        if not self.is_enabled():
            return default
        try:
            if isinstance(audio_path_or_bytes, (str, Path)):
                path = Path(audio_path_or_bytes)
                if not path.exists():
                    print(f"Modulate Velma-2: file not found {path}")
                    return default
                file_content = path.read_bytes()
                filename = filename or path.name
            else:
                file_content = audio_path_or_bytes
                if not filename:
                    filename = "audio.mp3"

            async with httpx.AsyncClient(timeout=120.0) as client:
                response = await client.post(
                    VELMA2_BATCH_URL,
                    headers={"X-API-Key": self.api_key},
                    files={"upload_file": (filename, file_content)},
                    data={
                        "speaker_diarization": "true",
                        "emotion_signal": "true",
                    },
                )
                response.raise_for_status()
                return response.json()
        except Exception as e:
            print(f"Modulate Velma-2 transcription error: {e}")
            return default


def get_modulate_client() -> ModulateClient:
    """Get Modulate client instance."""
    return ModulateClient()
