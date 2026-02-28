"""Workflow orchestrator for the startup simulation."""
import asyncio
import json
import logging
from datetime import datetime
from typing import Dict, Any

from crewai import Crew
from langchain.tools import Tool

from shared.models import (
    StartupDossier,
    RunStatus,
    AgentStep,
    ClarifiedIdea,
    MarketResearch,
    Positioning,
    MVPPlan,
    LandingPage,
    DebateSynthesis,
    FinanceModel,
    FinalReport,
    Competitor,
    Citation,
)
from services.storage import get_storage_backend
from services.agents.crew_agents import *
from services.agents.crew_tasks import *
from services.integrations.tavily_client import get_tavily_client
from services.integrations.neo4j_client import get_neo4j_client
from services.integrations.yutori_client import get_yutori_client
from services.integrations.senso_client import get_senso_client
from services.integrations.modulate_client import get_modulate_client
from services.integrations.numeric_client import get_numeric_client
from services.report_generator import generate_reports
from services.video_analysis import analyze_competitor_videos

logger = logging.getLogger(__name__)


class WorkflowOrchestrator:
    """Orchestrates the multi-agent workflow."""
    
    def __init__(self):
        self.storage = get_storage_backend()
        self.tavily = get_tavily_client()
        self.yutori = get_yutori_client()
        self.senso = get_senso_client()
        self.modulate = get_modulate_client()
        self.numeric = get_numeric_client()
    
    async def run_workflow(self, run_id: str, idea: str):
        """Run the complete workflow."""
        video_task = None
        try:
            logger.info(f"Starting workflow for run {run_id}")
            
            # Load dossier
            dossier = await self.storage.get_dossier(run_id)
            dossier.status = RunStatus.RUNNING
            await self.storage.save_dossier(dossier)
            
            # Step 1: Clarify
            await self._update_step(dossier, AgentStep.CLARIFIER)
            clarified = await self._run_clarifier(idea)
            dossier.clarified_idea = clarified
            await self.storage.save_dossier(dossier)
            
            # Step 2: Market Research
            await self._update_step(dossier, AgentStep.MARKET_RESEARCH)
            market = await self._run_market_research(clarified)
            dossier.market_research = market
            await self.storage.save_dossier(dossier)
            
            # Store in Neo4j
            await self._store_market_graph(run_id, idea, market, [])

            # Fire-and-forget: video analysis runs concurrently with
            # the remaining pipeline so the main results are not delayed.
            video_task = asyncio.create_task(
                self._run_video_analysis_background(run_id, idea)
            )
            
            # Step 3: Positioning
            await self._update_step(dossier, AgentStep.POSITIONING)
            positioning = await self._run_positioning(clarified, market)
            dossier.positioning = positioning
            await self.storage.save_dossier(dossier)
            
            # Update Neo4j with differentiators
            await self._store_market_graph(
                run_id, idea, market, positioning.differentiators
            )
            
            # Step 4: MVP Plan
            await self._update_step(dossier, AgentStep.MVP_PLANNER)
            mvp = await self._run_mvp_planner(clarified, positioning)
            dossier.mvp_plan = mvp
            await self.storage.save_dossier(dossier)
            
            # Step 5: Landing Copy
            await self._update_step(dossier, AgentStep.LANDING_COPY)
            landing = await self._run_landing_copy(clarified, positioning)
            # Moderate landing copy
            landing.headline = await self.modulate.revise_if_unsafe(landing.headline)
            dossier.landing_page = landing
            await self.storage.save_dossier(dossier)
            
            # Step 6-8: Investor Debate
            await self._update_step(dossier, AgentStep.BULL_INVESTOR)
            bull_args = await self._run_bull_investor(clarified, market, positioning, mvp)
            
            await self._update_step(dossier, AgentStep.SKEPTIC_INVESTOR)
            skeptic_args = await self._run_skeptic_investor(clarified, market, positioning, mvp)
            
            await self._update_step(dossier, AgentStep.MODERATOR)
            debate = await self._run_moderator(bull_args, skeptic_args)
            dossier.debate = debate
            await self.storage.save_dossier(dossier)
            
            # Step 9: Finance
            await self._update_step(dossier, AgentStep.FINANCE)
            finance = await self._run_finance(clarified, landing)
            dossier.finance = finance
            await self.storage.save_dossier(dossier)
            
            # Step 10: Finalizer
            await self._update_step(dossier, AgentStep.FINALIZER)
            final = await self._run_finalizer(dossier)
            dossier.final_report = final
            await self.storage.save_dossier(dossier)
            
            # Generate reports
            await generate_reports(run_id, dossier, self.storage)
            
            # Index in Senso
            if self.senso.is_enabled():
                await self.senso.index_dossier(run_id, dossier)
            
            # Mark complete — the main pipeline is done; video_analysis
            # may still be running and will update the dossier on its own.
            dossier.status = RunStatus.COMPLETED
            dossier.updated_at = datetime.utcnow()
            await self.storage.save_dossier(dossier)
            
            logger.info(f"Workflow completed for run {run_id}")

            # Don't abandon the video task — let it finish and persist
            # its results even after the main pipeline is done.
            if video_task and not video_task.done():
                logger.info(f"Video analysis still running for {run_id}; awaiting in background")
                try:
                    await video_task
                except Exception:
                    pass  # errors already handled inside the task
            
        except Exception as e:
            logger.error(f"Workflow error for run {run_id}: {e}", exc_info=True)
            dossier = await self.storage.get_dossier(run_id)
            dossier.status = RunStatus.FAILED
            dossier.error = str(e)
            await self.storage.save_dossier(dossier)
    
    async def _update_step(self, dossier: StartupDossier, step: AgentStep):
        """Update current step."""
        dossier.current_step = step
        dossier.updated_at = datetime.utcnow()
        dossier.provenance[f"{step}_started"] = datetime.utcnow().isoformat()
        await self.storage.save_dossier(dossier)
    
    async def _run_clarifier(self, idea: str) -> ClarifiedIdea:
        """Run clarifier agent."""
        agent = create_clarifier_agent()
        task = create_clarifier_task(agent, idea)
        
        crew = Crew(agents=[agent], tasks=[task], verbose=True)
        result = crew.kickoff()
        
        # Parse result
        data = self._parse_json_result(result)
        return ClarifiedIdea(**data)
    
    async def _run_market_research(self, clarified: ClarifiedIdea) -> MarketResearch:
        """Run market research agent."""
        # Create search tool
        async def search_wrapper(query: str) -> str:
            citations = await self.tavily.search(query, max_results=10)
            return json.dumps([c.model_dump() for c in citations])
        
        search_tool = Tool(
            name="web_search",
            description="Search the web for competitors and market information",
            func=lambda q: search_wrapper(q),
        )
        
        agent = create_market_research_agent()
        task = create_market_research_task(
            agent,
            clarified.model_dump(),
            search_tool,
        )
        
        crew = Crew(agents=[agent], tasks=[task], verbose=True)
        result = crew.kickoff()
        
        data = self._parse_json_result(result)
        return MarketResearch(**data)
    
    async def _run_positioning(
        self, clarified: ClarifiedIdea, market: MarketResearch
    ) -> Positioning:
        """Run positioning agent."""
        agent = create_positioning_agent()
        context = {
            "clarified_idea": clarified.model_dump(),
            "competitors_summary": [c.name for c in market.competitors[:5]],
        }
        task = create_positioning_task(agent, context)
        
        crew = Crew(agents=[agent], tasks=[task], verbose=True)
        result = crew.kickoff()
        
        data = self._parse_json_result(result)
        return Positioning(**data)
    
    async def _run_mvp_planner(
        self, clarified: ClarifiedIdea, positioning: Positioning
    ) -> MVPPlan:
        """Run MVP planner agent."""
        agent = create_mvp_planner_agent()
        context = {
            "solution": clarified.solution,
            "value_proposition": clarified.value_proposition,
            "differentiators": positioning.differentiators,
        }
        task = create_mvp_task(agent, context)
        
        crew = Crew(agents=[agent], tasks=[task], verbose=True)
        result = crew.kickoff()
        
        data = self._parse_json_result(result)
        return MVPPlan(**data)
    
    async def _run_landing_copy(
        self, clarified: ClarifiedIdea, positioning: Positioning
    ) -> LandingPage:
        """Run landing copy agent."""
        agent = create_landing_copy_agent()
        context = {
            "value_proposition": clarified.value_proposition,
            "icp": positioning.icp,
            "differentiators": positioning.differentiators,
        }
        task = create_landing_copy_task(agent, context)
        
        crew = Crew(agents=[agent], tasks=[task], verbose=True)
        result = crew.kickoff()
        
        data = self._parse_json_result(result)
        return LandingPage(**data)
    
    async def _run_bull_investor(
        self, clarified, market, positioning, mvp
    ) -> Dict[str, Any]:
        """Run bull investor agent."""
        agent = create_bull_investor_agent()
        context = {
            "market_summary": f"{len(market.competitors)} competitors found",
            "positioning": positioning.positioning_statement,
            "mvp_summary": f"{len(mvp.features)} features planned",
        }
        task = create_bull_task(agent, context)
        
        crew = Crew(agents=[agent], tasks=[task], verbose=True)
        result = crew.kickoff()
        
        return self._parse_json_result(result)
    
    async def _run_skeptic_investor(
        self, clarified, market, positioning, mvp
    ) -> Dict[str, Any]:
        """Run skeptic investor agent."""
        agent = create_skeptic_investor_agent()
        context = {
            "market_summary": f"{len(market.competitors)} competitors found",
            "positioning": positioning.positioning_statement,
            "mvp_summary": f"{len(mvp.features)} features planned",
        }
        task = create_skeptic_task(agent, context)
        
        crew = Crew(agents=[agent], tasks=[task], verbose=True)
        result = crew.kickoff()
        
        return self._parse_json_result(result)
    
    async def _run_moderator(
        self, bull_args: Dict, skeptic_args: Dict
    ) -> DebateSynthesis:
        """Run moderator agent."""
        agent = create_moderator_agent()
        task = create_moderator_task(agent, bull_args, skeptic_args)
        
        crew = Crew(agents=[agent], tasks=[task], verbose=True)
        result = crew.kickoff()
        
        data = self._parse_json_result(result)
        return DebateSynthesis(**data)
    
    async def _run_finance(
        self, clarified: ClarifiedIdea, landing: LandingPage
    ) -> FinanceModel:
        """Run finance agent."""
        template = await self.numeric.get_template()
        
        agent = create_finance_agent()
        context = {
            "business_model": clarified.solution,
            "pricing": landing.pricing_tiers[0] if landing.pricing_tiers else {},
        }
        task = create_finance_task(agent, context, template)
        
        crew = Crew(agents=[agent], tasks=[task], verbose=True)
        result = crew.kickoff()
        
        data = self._parse_json_result(result)
        return FinanceModel(**data)
    
    async def _run_finalizer(self, dossier: StartupDossier) -> FinalReport:
        """Run finalizer agent."""
        agent = create_finalizer_agent()
        
        summary = {
            "idea": dossier.clarified_idea.model_dump() if dossier.clarified_idea else {},
            "market": f"{len(dossier.market_research.competitors)} competitors" if dossier.market_research else "No data",
            "positioning": dossier.positioning.positioning_statement if dossier.positioning else "",
            "mvp": f"{len(dossier.mvp_plan.features)} features" if dossier.mvp_plan else "No plan",
            "debate": dossier.debate.synthesis if dossier.debate else "",
            "finance": dossier.finance.outputs.model_dump() if dossier.finance else {},
        }
        
        task = create_finalizer_task(agent, summary)
        
        crew = Crew(agents=[agent], tasks=[task], verbose=True)
        result = crew.kickoff()
        
        data = self._parse_json_result(result)
        return FinalReport(**data)
    
    async def _store_market_graph(
        self, run_id: str, idea: str, market: MarketResearch, differentiators: list
    ):
        """Store market data in Neo4j."""
        try:
            neo4j = await get_neo4j_client()
            await neo4j.store_market_graph(
                run_id=run_id,
                idea=idea,
                competitors=[c.model_dump() for c in market.competitors],
                segments=[s.model_dump() for s in market.segments],
                differentiators=differentiators,
            )
        except Exception as e:
            logger.warning(f"Neo4j storage failed: {e}")
    
    async def _run_video_analysis_background(self, run_id: str, idea: str):
        """
        Run video analysis asynchronously.  Saves the result directly to the
        dossier so the SSE stream / polling endpoint picks it up automatically.
        This never raises — errors are logged and the dossier field is set to
        a result with an error message.
        """
        try:
            logger.info(f"Starting background video analysis for run {run_id}")
            result = await analyze_competitor_videos(idea, max_videos=3)
            dossier = await self.storage.get_dossier(run_id)
            dossier.video_analysis = result.model_dump()
            dossier.updated_at = datetime.utcnow()
            dossier.provenance["video_analysis_completed"] = datetime.utcnow().isoformat()
            await self.storage.save_dossier(dossier)
            logger.info(
                f"Video analysis completed for run {run_id}: "
                f"{len(result.videos)} video(s)"
            )
        except Exception as e:
            logger.error(f"Background video analysis failed for run {run_id}: {e}", exc_info=True)
            try:
                dossier = await self.storage.get_dossier(run_id)
                dossier.video_analysis = {
                    "videos": [],
                    "message": f"Video analysis failed: {e}",
                }
                dossier.updated_at = datetime.utcnow()
                await self.storage.save_dossier(dossier)
            except Exception:
                logger.error(f"Could not persist video analysis error for {run_id}")

    def _parse_json_result(self, result: Any) -> Dict[str, Any]:
        """Parse CrewAI result to JSON."""
        if isinstance(result, dict):
            return result
        
        result_str = str(result)
        
        # Try to extract JSON from markdown code blocks
        if "```json" in result_str:
            start = result_str.find("```json") + 7
            end = result_str.find("```", start)
            result_str = result_str[start:end].strip()
        elif "```" in result_str:
            start = result_str.find("```") + 3
            end = result_str.find("```", start)
            result_str = result_str[start:end].strip()
        
        try:
            return json.loads(result_str)
        except json.JSONDecodeError:
            logger.error(f"Failed to parse JSON: {result_str[:200]}")
            return {}
