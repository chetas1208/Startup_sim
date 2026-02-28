"""Tavily search client."""
import logging
from typing import List, Dict, Any

from tavily import TavilyClient

from config import settings

logger = logging.getLogger(__name__)


def tavily_search(query: str, max_results: int = 8) -> List[Dict[str, Any]]:
    """Run a Tavily web search and return results."""
    client = TavilyClient(api_key=settings.tavily_api_key)
    logger.info(f"Tavily search: {query[:80]}...")

    try:
        response = client.search(
            query=query,
            search_depth="advanced",
            max_results=max_results,
            include_answer=False,
        )
        results = response.get("results", [])
        logger.info(f"Tavily returned {len(results)} results")
        return results
    except Exception as e:
        logger.error(f"Tavily search failed: {e}")
        return []


def format_search_results(results: List[Dict[str, Any]]) -> str:
    """Format Tavily results into a text block for LLM consumption."""
    lines = []
    for i, r in enumerate(results, 1):
        lines.append(f"[{i}] {r.get('title', 'No title')}")
        lines.append(f"    URL: {r.get('url', '')}")
        lines.append(f"    {r.get('content', '')[:300]}")
        lines.append("")
    return "\n".join(lines)
