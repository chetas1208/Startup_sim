"""Tavily search client."""
import asyncio
from typing import Any, Dict, List, Optional

import httpx
from tavily import TavilyClient

from config import settings
from shared.models import Citation

TAVILY_RESEARCH_BASE = "https://api.tavily.com"


class TavilySearchClient:
    """Tavily API client for market research."""
    
    def __init__(self):
        self.client = TavilyClient(api_key=settings.tavily_api_key)
    
    async def search(
        self,
        query: str,
        max_results: int = 10,
        search_depth: str = "advanced",
    ) -> List[Citation]:
        """Search and return citations."""
        try:
            response = self.client.search(
                query=query,
                max_results=max_results,
                search_depth=search_depth,
                include_raw_content=False,
            )
            
            citations = []
            for result in response.get("results", []):
                citations.append(
                    Citation(
                        url=result.get("url", ""),
                        title=result.get("title", ""),
                        snippet=result.get("content", ""),
                        published_date=result.get("published_date"),
                    )
                )
            
            return citations
        except Exception as e:
            print(f"Tavily search error: {e}")
            return []
    
    async def extract_content(self, urls: List[str]) -> dict:
        """Extract content from specific URLs."""
        try:
            response = self.client.extract(urls=urls)
            return response
        except Exception as e:
            print(f"Tavily extract error: {e}")
            return {}

    async def research(
        self,
        input_query: str,
        model: str = "mini",
        output_schema: Optional[Dict[str, Any]] = None,
        poll_interval_seconds: float = 2.0,
        max_wait_seconds: float = 300.0,
    ) -> Dict[str, Any]:
        """
        Run a Tavily Research task and poll until complete.
        Returns the final result with 'content' and 'sources' (list of {title, url, favicon}).
        """
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                body: Dict[str, Any] = {
                    "input": input_query,
                    "model": model,
                }
                if output_schema is not None:
                    body["output_schema"] = output_schema

                create_resp = await client.post(
                    f"{TAVILY_RESEARCH_BASE}/research",
                    headers={"Authorization": f"Bearer {settings.tavily_api_key}"},
                    json=body,
                )
                create_resp.raise_for_status()
                data = create_resp.json()
                request_id = data.get("request_id")
                status = data.get("status", "")
                if not request_id:
                    return {"status": "failed", "content": "", "sources": []}

                elapsed = 0.0
                while status in ("pending", "in_progress") and elapsed < max_wait_seconds:
                    await asyncio.sleep(poll_interval_seconds)
                    elapsed += poll_interval_seconds
                    get_resp = await client.get(
                        f"{TAVILY_RESEARCH_BASE}/research/{request_id}",
                        headers={"Authorization": f"Bearer {settings.tavily_api_key}"},
                    )
                    if get_resp.status_code == 202:
                        data = get_resp.json()
                        status = data.get("status", "pending")
                        continue
                    if get_resp.status_code == 200:
                        data = get_resp.json()
                        status = data.get("status", "")
                        if status in ("completed", "failed"):
                            return data
                        continue
                    get_resp.raise_for_status()

                # Timeout: do one final GET
                get_resp = await client.get(
                    f"{TAVILY_RESEARCH_BASE}/research/{request_id}",
                    headers={"Authorization": f"Bearer {settings.tavily_api_key}"},
                )
                if get_resp.status_code == 200:
                    data = get_resp.json()
                    if data.get("status") in ("completed", "failed"):
                        return data
                return {"status": status or "timeout", "content": "", "sources": []}
        except Exception as e:
            print(f"Tavily research error: {e}")
            return {"status": "failed", "content": "", "sources": []}


def get_tavily_client() -> TavilySearchClient:
    """Get Tavily client instance."""
    return TavilySearchClient()
