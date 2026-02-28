"""Senso knowledge base / RAG client (optional)."""
import httpx
from typing import List

from config import settings
from shared.models import StartupDossier, Citation, AskQuestionResponse


class SensoClient:
    """Senso API client for RAG over dossiers."""
    
    def __init__(self):
        self.api_key = settings.senso_api_key
        self.base_url = "https://api.senso.ai/v1"
    
    def is_enabled(self) -> bool:
        """Check if Senso is configured."""
        return bool(self.api_key)
    
    async def index_dossier(self, run_id: str, dossier: StartupDossier):
        """Index a dossier for RAG retrieval."""
        if not self.is_enabled():
            return
        
        try:
            # Convert dossier to text chunks
            chunks = self._dossier_to_chunks(dossier)
            
            async with httpx.AsyncClient(timeout=30.0) as client:
                await client.post(
                    f"{self.base_url}/index",
                    headers={"Authorization": f"Bearer {self.api_key}"},
                    json={
                        "collection": f"run_{run_id}",
                        "documents": chunks,
                    },
                )
        except Exception as e:
            print(f"Senso indexing error: {e}")
    
    async def ask_question(
        self,
        run_id: str,
        question: str,
        dossier: StartupDossier,
    ) -> AskQuestionResponse:
        """Ask a question about the dossier."""
        if not self.is_enabled():
            # Fallback: simple keyword search
            return self._fallback_search(question, dossier)
        
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.post(
                    f"{self.base_url}/query",
                    headers={"Authorization": f"Bearer {self.api_key}"},
                    json={
                        "collection": f"run_{run_id}",
                        "query": question,
                        "top_k": 3,
                    },
                )
                response.raise_for_status()
                data = response.json()
                
                return AskQuestionResponse(
                    answer=data.get("answer", "No answer found."),
                    sources=[
                        Citation(
                            url=s.get("url", ""),
                            title=s.get("title", ""),
                            snippet=s.get("snippet", ""),
                        )
                        for s in data.get("sources", [])
                    ],
                )
        except Exception as e:
            print(f"Senso query error: {e}")
            return self._fallback_search(question, dossier)
    
    def _dossier_to_chunks(self, dossier: StartupDossier) -> List[dict]:
        """Convert dossier to indexable chunks."""
        chunks = []
        
        if dossier.clarified_idea:
            chunks.append({
                "text": f"Problem: {dossier.clarified_idea.problem}\nSolution: {dossier.clarified_idea.solution}",
                "metadata": {"section": "idea"},
            })
        
        if dossier.market_research:
            for comp in dossier.market_research.competitors:
                chunks.append({
                    "text": f"Competitor: {comp.name}\n{comp.description}",
                    "metadata": {"section": "competitors"},
                })
        
        if dossier.final_report:
            chunks.append({
                "text": f"Recommendation: {dossier.final_report.recommendation}\nReasoning: {dossier.final_report.scorecard.reasoning}",
                "metadata": {"section": "final"},
            })
        
        return chunks
    
    def _fallback_search(self, question: str, dossier: StartupDossier) -> AskQuestionResponse:
        """Simple fallback search without Senso."""
        q_lower = question.lower()
        
        if "competitor" in q_lower and dossier.market_research:
            comps = [c.name for c in dossier.market_research.competitors[:3]]
            return AskQuestionResponse(
                answer=f"Top competitors found: {', '.join(comps)}",
                sources=[],
            )
        
        if "recommendation" in q_lower or "go" in q_lower:
            if dossier.final_report:
                return AskQuestionResponse(
                    answer=f"Recommendation: {dossier.final_report.recommendation}. {dossier.final_report.scorecard.reasoning}",
                    sources=[],
                )
        
        return AskQuestionResponse(
            answer="Unable to answer. Senso RAG not configured.",
            sources=[],
        )


def get_senso_client() -> SensoClient:
    """Get Senso client instance."""
    return SensoClient()
