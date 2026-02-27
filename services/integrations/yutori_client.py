"""Yutori web actions client (optional)."""
import httpx
from typing import Optional, Dict, Any

from config import settings


class YutoriClient:
    """Yutori API client for deep web extraction."""
    
    def __init__(self):
        self.api_key = settings.yutori_api_key
        self.base_url = "https://api.yutori.ai/v1"
    
    def is_enabled(self) -> bool:
        """Check if Yutori is configured."""
        return bool(self.api_key)
    
    async def extract_deep_content(self, url: str) -> Optional[Dict[str, Any]]:
        """Extract deep content from a URL."""
        if not self.is_enabled():
            return None
        
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.post(
                    f"{self.base_url}/extract",
                    headers={"Authorization": f"Bearer {self.api_key}"},
                    json={"url": url, "mode": "deep"},
                )
                response.raise_for_status()
                return response.json()
        except Exception as e:
            print(f"Yutori extraction error: {e}")
            return None


def get_yutori_client() -> YutoriClient:
    """Get Yutori client instance."""
    return YutoriClient()
