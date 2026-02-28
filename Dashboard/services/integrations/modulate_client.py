"""Modulate content moderation client (optional)."""
import httpx
from typing import Dict, Any

from config import settings


class ModulateClient:
    """Modulate API client for content safety."""
    
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


def get_modulate_client() -> ModulateClient:
    """Get Modulate client instance."""
    return ModulateClient()
