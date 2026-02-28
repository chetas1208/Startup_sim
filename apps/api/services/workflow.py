"""WorkflowOrchestrator — runs the full VentureForge 8-step pipeline."""
import asyncio
import json
import logging
from datetime import datetime
from typing import Optional

from config import settings
from shared.models import (
    VentureDossier, AgentStep, RunStatus,
    ClarifiedIdea, MarketResearch, CompetitiveAnalysis,
    StrategyPositioning, VCInterview, FundingStrategy,
    Scorecard, Competitor, Citation, VCQuestion,
)
from services.integrations.llm_client import llm_json
from services.integrations.tavily_client import tavily_search, format_search_results

logger = logging.getLogger(__name__)

SYSTEM = """You are VentureForge, an AI-powered startup research engine.
Return ONLY valid JSON. No commentary, no markdown outside JSON fences.
If data is unknown, write "unknown". Be concise and analytical."""


class WorkflowOrchestrator:
    """Runs the full pipeline in order, saving after each step."""

    def __init__(self):
        from app.storage import get_storage_backend
        self.storage = get_storage_backend()

    async def run_workflow(self, run_id: str, idea_text: str):
        """Execute all 8 steps."""
        dossier = await self.storage.get_dossier(run_id)
        if not dossier:
            dossier = VentureDossier(run_id=run_id, idea_text=idea_text)

        dossier.status = RunStatus.RUNNING
        await self.storage.save_dossier(dossier)

        try:
            # Step 1: Clarify
            await self._set_step(dossier, AgentStep.CLARIFIER)
            dossier.clarification = await self._clarify(idea_text)
            await self.storage.save_dossier(dossier)

            # Step 2: Market Search (Tavily)
            await self._set_step(dossier, AgentStep.MARKET_SEARCH)
            search_results = await self._market_search(dossier.clarification)
            await self.storage.save_dossier(dossier)

            # Step 3: Deep Extract (LLM-based extraction from search results)
            await self._set_step(dossier, AgentStep.DEEP_EXTRACT)
            extracted = await self._deep_extract(dossier.clarification, search_results)
            await self.storage.save_dossier(dossier)

            # Step 4: Normalize (structure the data)
            await self._set_step(dossier, AgentStep.NORMALIZE)
            dossier.market_research = await self._normalize(dossier.clarification, extracted, search_results)
            await self.storage.save_dossier(dossier)

            # Step 5: Market Synthesis
            await self._set_step(dossier, AgentStep.MARKET_SYNTHESIS)
            dossier.strategy = await self._synthesize(dossier.clarification, dossier.market_research)
            await self.storage.save_dossier(dossier)

            # Step 6: Competitive Analysis
            await self._set_step(dossier, AgentStep.COMPETITIVE_ANALYSIS)
            dossier.competitive_analysis = await self._compete(dossier.clarification, dossier.market_research)
            await self.storage.save_dossier(dossier)

            # Step 7: VC Interview Simulation
            await self._set_step(dossier, AgentStep.VC_INTERVIEW)
            dossier.vc_interview = await self._vc_interview(dossier)
            await self.storage.save_dossier(dossier)

            # Step 8: Funding Strategy + Scorecard
            await self._set_step(dossier, AgentStep.FUNDING_STRATEGY)
            funding, scorecard = await self._funding(dossier)
            dossier.funding_strategy = funding
            dossier.scorecard = scorecard
            await self.storage.save_dossier(dossier)

            # DONE
            dossier.status = RunStatus.DONE
            dossier.current_step = None
            dossier.updated_at = datetime.utcnow()
            await self.storage.save_dossier(dossier)
            logger.info(f"Pipeline DONE for {run_id}")

        except Exception as e:
            logger.error(f"Pipeline FAILED for {run_id}: {e}", exc_info=True)
            dossier.status = RunStatus.ERROR
            dossier.error = str(e)
            await self.storage.save_dossier(dossier)

    # ── helpers ──────────────────────────────────────────────────────

    async def _set_step(self, dossier: VentureDossier, step: AgentStep):
        dossier.current_step = step
        dossier.updated_at = datetime.utcnow()
        await self.storage.save_dossier(dossier)

    # ── Step 1: Clarify ──────────────────────────────────────────────

    async def _clarify(self, idea_text: str) -> ClarifiedIdea:
        prompt = f"""Parse this startup idea into structured JSON.

Startup idea: "{idea_text}"

Return JSON:
{{
  "idea_title": "short catchy name",
  "target_customer": "specific primary buyer",
  "core_problem": "single biggest pain point",
  "proposed_solution": "how the startup solves it",
  "key_assumptions": ["assumption1", "assumption2", "assumption3"],
  "measurable_outcome": "KPI to measure success",
  "keywords": ["keyword1", "keyword2", "keyword3", "keyword4"]
}}"""
        data = await llm_json(SYSTEM, prompt)
        return ClarifiedIdea(**data)

    # ── Step 2: Market Search ────────────────────────────────────────

    async def _market_search(self, clarification: ClarifiedIdea) -> list:
        keywords = clarification.keywords or [clarification.idea_title]
        queries = [
            f"{clarification.idea_title} competitors market",
            f"{' '.join(keywords[:3])} startups companies",
            f"{clarification.core_problem} solutions pricing",
        ]
        all_results = []
        for q in queries:
            results = await asyncio.to_thread(tavily_search, q, 5)
            all_results.extend(results)
        return all_results

    # ── Step 3: Deep Extract ─────────────────────────────────────────

    async def _deep_extract(self, clarification: ClarifiedIdea, search_results: list) -> dict:
        formatted = format_search_results(search_results)
        prompt = f"""From these search results, extract ALL competitor companies and their details.

Startup idea: {clarification.idea_title} — {clarification.proposed_solution}

Search results:
{formatted}

Return JSON:
{{
  "competitors": [
    {{
      "name": "company name",
      "url": "website url",
      "description": "what they do (1-2 sentences)",
      "pricing": "pricing if found, else unknown",
      "features": ["feature1", "feature2"],
      "segment": "market segment"
    }}
  ],
  "market_signals": ["signal1", "signal2"]
}}"""
        return await llm_json(SYSTEM, prompt)

    # ── Step 4: Normalize ────────────────────────────────────────────

    async def _normalize(self, clarification: ClarifiedIdea, extracted: dict, search_results: list) -> MarketResearch:
        competitors_raw = extracted.get("competitors", [])
        citations = []
        for r in search_results:
            url = r.get("url", "")
            citations.append(Citation(
                url=url,
                title=r.get("title", ""),
                snippet=r.get("content", "")[:200],
                domain=url.split("//")[-1].split("/")[0] if "//" in url else url,
            ))

        competitors = []
        for c in competitors_raw:
            competitors.append(Competitor(
                name=c.get("name", ""),
                url=c.get("url"),
                description=c.get("description", ""),
                pricing=c.get("pricing"),
                features=c.get("features", []),
                segment=c.get("segment", ""),
                positioning=c.get("positioning", ""),
            ))

        # Use LLM to generate summary and gaps
        comp_text = json.dumps([c.model_dump() for c in competitors], indent=2)
        prompt = f"""Given these competitors for "{clarification.idea_title}":

{comp_text}

Return JSON:
{{
  "summary": "2-3 sentence market overview with any dollar figures from the data",
  "segments": ["segment1", "segment2", "segment3"],
  "market_gaps": ["gap1", "gap2", "gap3", "gap4"]
}}"""
        synthesis = await llm_json(SYSTEM, prompt)

        # Deduplicate competitors by name
        seen = set()
        unique_competitors = []
        for c in competitors:
            if c.name.lower() not in seen:
                seen.add(c.name.lower())
                unique_competitors.append(c)

        return MarketResearch(
            summary=synthesis.get("summary", ""),
            segments=synthesis.get("segments", []),
            market_gaps=synthesis.get("market_gaps", []),
            competitors=unique_competitors[:8],
            citations=citations[:10],
        )

    # ── Step 5: Synthesize (Strategy) ────────────────────────────────

    async def _synthesize(self, clarification: ClarifiedIdea, market: MarketResearch) -> StrategyPositioning:
        prompt = f"""Given this startup and market research, create strategic positioning.

Idea: {clarification.idea_title}
Problem: {clarification.core_problem}
Solution: {clarification.proposed_solution}
Customer: {clarification.target_customer}

Market: {market.summary}
Gaps: {json.dumps(market.market_gaps)}
Competitors: {json.dumps([c.name for c in market.competitors])}

Return JSON:
{{
  "icp": "detailed ideal customer profile (2-3 sentences)",
  "positioning_statement": "X for Y positioning (1 sentence)",
  "differentiation_angle": "unique wedge into the market",
  "strategic_focus": "top 3 recommendations narrative",
  "risks": ["risk1", "risk2", "risk3"],
  "recommended_next_steps": ["step1", "step2", "step3"]
}}"""
        data = await llm_json(SYSTEM, prompt)
        return StrategyPositioning(**data)

    # ── Step 6: Competitive Analysis ─────────────────────────────────

    async def _compete(self, clarification: ClarifiedIdea, market: MarketResearch) -> CompetitiveAnalysis:
        comp_data = json.dumps([c.model_dump() for c in market.competitors], indent=2)
        prompt = f"""Deep competitive analysis for "{clarification.idea_title}".

Competitors:
{comp_data}

Our solution: {clarification.proposed_solution}

Return JSON:
{{
  "competitive_summary": "2-3 paragraph analysis of competitive landscape",
  "overlap_assessment": "how similar is our concept to top competitors",
  "differentiation_opportunities": ["opp1", "opp2", "opp3", "opp4"],
  "top_threats": ["threat1", "threat2", "threat3", "threat4"],
  "competitor_comparison": [
    {{
      "competitor": "name",
      "focus": "their strategic focus",
      "features": ["f1", "f2"],
      "advantage": "their key advantage"
    }}
  ]
}}"""
        data = await llm_json(SYSTEM, prompt)
        return CompetitiveAnalysis(**data)

    # ── Step 7: VC Interview ─────────────────────────────────────────

    async def _vc_interview(self, dossier: VentureDossier) -> VCInterview:
        context = f"""Startup: {dossier.clarification.idea_title}
Problem: {dossier.clarification.core_problem}
Solution: {dossier.clarification.proposed_solution}
Market: {dossier.market_research.summary if dossier.market_research else 'N/A'}
Strategy: {dossier.strategy.positioning_statement if dossier.strategy else 'N/A'}"""

        prompt = f"""Simulate a 5-question VC interview for this startup.

{context}

For each question, provide: the question, why it matters, a plausible founder answer, and rate the answer strength 1-10.

Return JSON:
{{
  "questions": [
    {{
      "question": "...",
      "why_it_matters": "...",
      "answer": "...",
      "strength_score": 7
    }}
  ],
  "vc_feedback": "overall VC feedback paragraph",
  "investment_risk_level": "Low|Medium|High"
}}"""
        data = await llm_json(SYSTEM, prompt)
        questions = [VCQuestion(**q) for q in data.get("questions", [])]
        return VCInterview(
            questions=questions,
            vc_feedback=data.get("vc_feedback", ""),
            investment_risk_level=data.get("investment_risk_level", "Medium"),
        )

    # ── Step 8: Funding + Scorecard ──────────────────────────────────

    async def _funding(self, dossier: VentureDossier) -> tuple:
        context = f"""Startup: {dossier.clarification.idea_title}
Solution: {dossier.clarification.proposed_solution}
Market: {dossier.market_research.summary if dossier.market_research else ''}
Risk: {dossier.vc_interview.investment_risk_level if dossier.vc_interview else 'Medium'}"""

        prompt = f"""Given this startup context, recommend funding strategy AND provide a scorecard.

{context}

Return JSON:
{{
  "funding": {{
    "recommended_funding_type": "Bootstrapped|Angel|Seed VC|Debt|Grants",
    "why": "rationale",
    "estimated_capital_needed": "$X.XM",
    "use_of_funds": ["item1 — X%", "item2 — X%"],
    "milestones_for_next_round": ["milestone1", "milestone2"]
  }},
  "scorecard": {{
    "overall_score": 7.5,
    "dimensions": [
      {{"label": "Market Size", "score": 8, "max": 10}},
      {{"label": "Differentiation", "score": 7, "max": 10}},
      {{"label": "Execution Risk", "score": 6, "max": 10}},
      {{"label": "Technical Moat", "score": 7, "max": 10}},
      {{"label": "Go-to-Market", "score": 6, "max": 10}},
      {{"label": "Team Readiness", "score": 7, "max": 10}}
    ],
    "recommendation": "Go/No-Go recommendation paragraph"
  }}
}}"""
        data = await llm_json(SYSTEM, prompt)
        funding = FundingStrategy(**data.get("funding", {}))
        scorecard = Scorecard(**data.get("scorecard", {}))
        return funding, scorecard
