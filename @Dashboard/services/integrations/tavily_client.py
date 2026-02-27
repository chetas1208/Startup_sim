"""Tavily search client."""
from typing import List
from tavily import TavilyClient

from config import settings
from shared.models import Citation


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


def get_tavily_client() -> TavilySearchClient:
    """Get Tavily client instance."""
    return TavilySearchClient()
