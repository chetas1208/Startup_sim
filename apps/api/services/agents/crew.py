"""CrewAI core orchestration for VentureForge."""
import json
import logging
from datetime import datetime
from typing import Dict, Any, List

from crewai import Agent, Task, Crew
from langchain.tools import Tool
from langchain_openai import ChatOpenAI

from app.config import settings
from shared.models import (
    VentureDossier,
    AgentStep,
    RunStatus,
    ClarifiedIdea,
    MarketResearch,
    CompetitiveAnalysis,
    StrategyPositioning,
)
from services.integrations.tavily_client import get_tavily_client
from services.agents.prompts import *

logger = logging.getLogger(__name__)


def get_llm():
    """Get the preferred LLM (supports NVIDIA NIM, OpenAI, etc.)."""
    kwargs = {
        "model": settings.llm_model,
        "temperature":0,
        "api_key": settings.openai_api_key,
    }
    if settings.openai_base_url:
        kwargs["base_url"] = settings.openai_base_url
    return ChatOpenAI(**kwargs)


async def run_venture_forge_pipeline(run_id: str, idea_text: str, dossier: VentureDossier, storage):
    """Execution of the 4-agent VentureForge pipeline."""
    try:
        # 1. IDEA CLARIFICATION
        await update_step(dossier, AgentStep.CLARIFIER, storage)
        dossier.clarification = await _run_clarifier(idea_text)
        await storage.save_dossier(dossier)

        # 2. MARKET RESEARCH
        await update_step(dossier, AgentStep.MARKET_RESEARCH, storage)
        dossier.market_research = await _run_market_research(dossier.clarification)
        await storage.save_dossier(dossier)
        
        # Store graph data in Neo4j
        try:
            from services.integrations.neo4j_client import get_neo4j_client
            neo4j = await get_neo4j_client()
            await neo4j.store_market_graph(
                run_id=run_id,
                idea=idea_text,
                competitors=[c.model_dump() for c in dossier.market_research.competitors],
                segments=[], # Add segments if researched
                differentiators=[]
            )
        except Exception as e:
            logger.warning(f"Neo4j storage failed for {run_id}: {e}")

        # 3. COMPETITIVE ANALYSIS
        await update_step(dossier, AgentStep.COMPETITIVE_ANALYSIS, storage)
        dossier.competitive_analysis = await _run_competitive_analysis(
            dossier.clarification, dossier.market_research
        )
        await storage.save_dossier(dossier)

        # 4. STRATEGY & POSITIONING
        await update_step(dossier, AgentStep.STRATEGY, storage)
        dossier.strategy = await _run_strategy(
            dossier.clarification, 
            dossier.market_research, 
            dossier.competitive_analysis
        )
        
        dossier.status = RunStatus.DONE
        dossier.updated_at = datetime.utcnow()
        await storage.save_dossier(dossier)

    except Exception as e:
        logger.error(f"VentureForge pipeline failed for {run_id}: {e}", exc_info=True)
        dossier.status = RunStatus.ERROR
        dossier.error = str(e)
        await storage.save_dossier(dossier)


async def update_step(dossier: VentureDossier, step: AgentStep, storage):
    """Status update utility."""
    dossier.current_step = step
    dossier.updated_at = datetime.utcnow()
    await storage.save_dossier(dossier)


async def _run_clarifier(idea_text: str) -> ClarifiedIdea:
    """Clarifier Agent implementation."""
    agent = Agent(
        role="Venture Clarifier",
        goal="Clarify startup ideas into structured business models.",
        backstory=CLARIFIER_BACKSTORY,
        llm=get_llm(),
        verbose=True
    )
    task = Task(
        description=CLARIFIER_PROMPT.format(idea_text=idea_text),
        agent=agent,
        expected_output="JSON with customer, problem, solution, assumptions, outcome"
    )
    crew = Crew(agents=[agent], tasks=[task], verbose=True)
    result = crew.kickoff()
    return ClarifiedIdea(**_parse_json(result))


async def _run_market_research(clarification: ClarifiedIdea) -> MarketResearch:
    """Market Research Agent implementation."""
    tavily = get_tavily_client()
    
    async def search_tool_fn(query: str) -> str:
        results = await tavily.search(query, max_results=10)
        return json.dumps([r.model_dump() for r in results])

    search_tool = Tool(
        name="MarketSearch",
        description="Live web search for competitors and market trends.",
        func=lambda q: search_tool_fn(q)
    )

    agent = Agent(
        role="Market Research Analyst",
        goal="Discover real competitors and market gaps using live search.",
        backstory=MARKET_RESEARCH_BACKSTORY,
        llm=get_llm(),
        tools=[search_tool],
        verbose=True
    )
    task = Task(
        description=MARKET_RESEARCH_PROMPT.format(clarification=clarification.model_dump_json()),
        agent=agent,
        expected_output="JSON with competitors, market_gaps, citations"
    )
    crew = Crew(agents=[agent], tasks=[task], verbose=True)
    result = crew.kickoff()
    return MarketResearch(**_parse_json(result))


async def _run_competitive_analysis(
    clarification: ClarifiedIdea, 
    market_research: MarketResearch
) -> CompetitiveAnalysis:
    """Competitive Analyst implementation."""
    agent = Agent(
        role="Competitive Analyst",
        goal="Acess overlap and differentiation vs existing competitors.",
        backstory=COMPETITIVE_ANALYST_BACKSTORY,
        llm=get_llm(),
        verbose=True
    )
    task = Task(
        description=COMPETITIVE_ANALYSIS_PROMPT.format(
            clarification=clarification.model_dump_json(),
            market_research=market_research.model_dump_json()
        ),
        agent=agent,
        expected_output="JSON with overlap assessment, differentiation gaps, comparison"
    )
    crew = Crew(agents=[agent], tasks=[task], verbose=True)
    result = crew.kickoff()
    return CompetitiveAnalysis(**_parse_json(result))


async def _run_strategy(
    clarification: ClarifiedIdea,
    market_research: MarketResearch,
    competitive_analysis: CompetitiveAnalysis
) -> StrategyPositioning:
    """Strategy Agent implementation."""
    agent = Agent(
        role="Strategic Advisor",
        goal="Determine ICP, positioning, and strategic focus.",
        backstory=STRATEGY_BACKSTORY,
        llm=get_llm(),
        verbose=True
    )
    task = Task(
        description=STRATEGY_POSITIONING_PROMPT.format(
            clarification=clarification.model_dump_json(),
            market_research=market_research.model_dump_json(),
            competitive_analysis=competitive_analysis.model_dump_json()
        ),
        agent=agent,
        expected_output="JSON with ICP, positioning statement, differentiation angle, strategic focus"
    )
    crew = Crew(agents=[agent], tasks=[task], verbose=True)
    result = crew.kickoff()
    return StrategyPositioning(**_parse_json(result))


def _parse_json(result: Any) -> Dict[str, Any]:
    """Extract and parse JSON from CrewAI output."""
    if isinstance(result, dict):
        return result
    text = str(result)
    if "```json" in text:
        text = text.split("```json")[1].split("```")[0].strip()
    elif "```" in text:
        text = text.split("```")[1].split("```")[0].strip()
    try:
        return json.loads(text)
    except Exception:
        logger.error(f"Failed to parse JSON from: {text[:200]}")
        return {}
