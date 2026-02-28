"""CrewAI crew orchestration and agent execution."""
import json
import logging
from datetime import datetime
from typing import Dict, Any, List

from crewai import Agent, Task, Crew
from langchain.tools import Tool
from langchain_openai import ChatOpenAI

from app.config import settings
from app.models.dossier import (
    StartupDossier,
    AgentStep,
    ClarifiedIdea,
    MarketResearch,
    Positioning,
    MVPPlan,
    LandingPage,
    DebateSynthesis,
    FinanceModel,
    FinalReport,
    CompetitiveMatrix,
    AssumptionTracker,
    ValidationExperiment,
    TAMEstimate,
    DestroyAnalysis,
    DistributionStrategy,
    ConfidenceScore,
)
from services.integrations.tavily_client import get_tavily_client
from services.integrations.neo4j_client import get_neo4j_client
from services.integrations.modulate_client import get_modulate_client
from services.integrations.numeric_client import get_numeric_client
from services.agents.prompts import *

logger = logging.getLogger(__name__)


def get_llm():
    """Get OpenAI LLM instance."""
    return ChatOpenAI(
        model="gpt-4-turbo-preview",
        temperature=0.7,
        api_key=settings.openai_api_key,
    )


async def run_crew_workflow(run_id: str, idea: str, dossier: StartupDossier, storage):
    """Run the complete CrewAI workflow."""
    
    # Step 1: Clarifier
    await update_step(dossier, AgentStep.CLARIFIER, storage)
    dossier.clarified_idea = await run_clarifier(idea)
    await storage.save_dossier(dossier)
    
    # Step 2: Market Research
    await update_step(dossier, AgentStep.MARKET_RESEARCH, storage)
    dossier.market_research = await run_market_research(dossier.clarified_idea)
    await storage.save_dossier(dossier)
    
    # Store in Neo4j
    await store_market_graph(run_id, idea, dossier.market_research, [])
    
    # Step 3: Positioning
    await update_step(dossier, AgentStep.POSITIONING, storage)
    dossier.positioning = await run_positioning(dossier.clarified_idea, dossier.market_research)
    await storage.save_dossier(dossier)
    
    # Update Neo4j with differentiators
    await store_market_graph(run_id, idea, dossier.market_research, dossier.positioning.differentiators)
    
    # Step 4: MVP Plan
    await update_step(dossier, AgentStep.MVP_PLANNER, storage)
    dossier.mvp_plan = await run_mvp_planner(dossier.clarified_idea, dossier.positioning)
    await storage.save_dossier(dossier)
    
    # Step 5: Landing Copy
    await update_step(dossier, AgentStep.LANDING_COPY, storage)
    dossier.landing_page = await run_landing_copy(dossier.clarified_idea, dossier.positioning)
    # Moderate landing copy
    modulate = get_modulate_client()
    dossier.landing_page.headline = await modulate.revise_if_unsafe(dossier.landing_page.headline)
    await storage.save_dossier(dossier)
    
    # Step 6-8: Investor Debate
    await update_step(dossier, AgentStep.BULL_INVESTOR, storage)
    bull_args = await run_bull_investor(dossier)
    
    await update_step(dossier, AgentStep.SKEPTIC_INVESTOR, storage)
    skeptic_args = await run_skeptic_investor(dossier)
    
    await update_step(dossier, AgentStep.MODERATOR, storage)
    dossier.debate = await run_moderator(bull_args, skeptic_args)
    await storage.save_dossier(dossier)
    
    # Step 9: Finance
    await update_step(dossier, AgentStep.FINANCE, storage)
    dossier.finance = await run_finance(dossier.clarified_idea, dossier.landing_page)
    await storage.save_dossier(dossier)
    
    # High-Impact Features (Tier 1)
    
    # Competitive Matrix
    try:
        dossier.competitive_matrix = await run_competitive_matrix(dossier)
        await storage.save_dossier(dossier)
    except Exception as e:
        logger.error(f"Competitive matrix failed: {e}")
    
    # Assumption Tracker
    try:
        dossier.assumption_tracker = await run_assumption_tracker(dossier)
        await storage.save_dossier(dossier)
    except Exception as e:
        logger.error(f"Assumption tracker failed: {e}")
    
    # Validation Experiments
    try:
        dossier.validation_experiments = await run_validation_experiments(dossier)
        await storage.save_dossier(dossier)
    except Exception as e:
        logger.error(f"Validation experiments failed: {e}")
    
    # TAM Estimate
    try:
        dossier.tam_estimate = await run_tam_estimate(dossier)
        await storage.save_dossier(dossier)
    except Exception as e:
        logger.error(f"TAM estimate failed: {e}")
    
    # Destroy Analysis
    try:
        dossier.destroy_analysis = await run_destroy_analysis(dossier)
        await storage.save_dossier(dossier)
    except Exception as e:
        logger.error(f"Destroy analysis failed: {e}")
    
    # Distribution Strategy
    try:
        dossier.distribution_strategy = await run_distribution_strategy(dossier)
        await storage.save_dossier(dossier)
    except Exception as e:
        logger.error(f"Distribution strategy failed: {e}")
    
    # Confidence Score
    try:
        dossier.confidence_score = await run_confidence_score(dossier)
        await storage.save_dossier(dossier)
    except Exception as e:
        logger.error(f"Confidence score failed: {e}")
    
    # Step 10: Finalizer
    await update_step(dossier, AgentStep.FINALIZER, storage)
    dossier.final_report = await run_finalizer(dossier)
    await storage.save_dossier(dossier)
    
    return dossier


async def update_step(dossier: StartupDossier, step: AgentStep, storage):
    """Update current step."""
    dossier.current_step = step
    dossier.updated_at = datetime.utcnow()
    dossier.provenance[f"{step}_started"] = datetime.utcnow().isoformat()
    await storage.save_dossier(dossier)


# Agent execution functions

async def run_clarifier(idea: str) -> ClarifiedIdea:
    """Run clarifier agent."""
    agent = Agent(
        role="Startup Idea Clarifier",
        goal="Transform vague startup ideas into structured, actionable concepts",
        backstory=CLARIFIER_BACKSTORY,
        llm=get_llm(),
        verbose=True,
        allow_delegation=False,
    )
    
    task = Task(
        description=CLARIFIER_PROMPT.format(idea=idea),
        agent=agent,
        expected_output="Structured JSON with problem, solution, target_customer, value_proposition, and assumptions",
    )
    
    crew = Crew(agents=[agent], tasks=[task], verbose=True)
    result = crew.kickoff()
    
    data = parse_json_result(result)
    return ClarifiedIdea(**data)


async def run_market_research(clarified: ClarifiedIdea) -> MarketResearch:
    """Run market research agent."""
    tavily = get_tavily_client()
    
    async def search_wrapper(query: str) -> str:
        citations = await tavily.search(query, max_results=10)
        return json.dumps([c.model_dump() for c in citations])
    
    search_tool = Tool(
        name="web_search",
        description="Search the web for competitors and market information",
        func=lambda q: search_wrapper(q),
    )
    
    agent = Agent(
        role="Market Research Analyst",
        goal="Conduct comprehensive competitive analysis and market sizing",
        backstory=MARKET_RESEARCH_BACKSTORY,
        llm=get_llm(),
        verbose=True,
        allow_delegation=False,
    )
    
    task = Task(
        description=MARKET_RESEARCH_PROMPT.format(
            problem=clarified.problem,
            solution=clarified.solution,
            target=clarified.target_customer,
        ),
        agent=agent,
        expected_output="Structured JSON with competitors, segments, trends, and citations",
        tools=[search_tool],
    )
    
    crew = Crew(agents=[agent], tasks=[task], verbose=True)
    result = crew.kickoff()
    
    data = parse_json_result(result)
    return MarketResearch(**data)


async def run_positioning(clarified: ClarifiedIdea, market: MarketResearch) -> Positioning:
    """Run positioning agent."""
    agent = Agent(
        role="Positioning Strategist",
        goal="Define clear positioning and differentiation strategy",
        backstory=POSITIONING_BACKSTORY,
        llm=get_llm(),
        verbose=True,
        allow_delegation=False,
    )
    
    task = Task(
        description=POSITIONING_PROMPT.format(
            idea=clarified.model_dump_json(),
            competitors=[c.name for c in market.competitors[:5]],
        ),
        agent=agent,
        expected_output="Structured JSON with icp, positioning_statement, differentiators, and unique_value",
    )
    
    crew = Crew(agents=[agent], tasks=[task], verbose=True)
    result = crew.kickoff()
    
    data = parse_json_result(result)
    return Positioning(**data)


async def run_mvp_planner(clarified: ClarifiedIdea, positioning: Positioning) -> MVPPlan:
    """Run MVP planner agent."""
    agent = Agent(
        role="MVP Product Manager",
        goal="Design a lean, focused MVP with a realistic 4-week roadmap",
        backstory=MVP_PLANNER_BACKSTORY,
        llm=get_llm(),
        verbose=True,
        allow_delegation=False,
    )
    
    task = Task(
        description=MVP_PLANNER_PROMPT.format(
            solution=clarified.solution,
            value_prop=clarified.value_proposition,
            differentiators=positioning.differentiators,
        ),
        agent=agent,
        expected_output="Structured JSON with features, roadmap, and success_metrics",
    )
    
    crew = Crew(agents=[agent], tasks=[task], verbose=True)
    result = crew.kickoff()
    
    data = parse_json_result(result)
    return MVPPlan(**data)


async def run_landing_copy(clarified: ClarifiedIdea, positioning: Positioning) -> LandingPage:
    """Run landing copy agent."""
    agent = Agent(
        role="Conversion Copywriter",
        goal="Write compelling landing page copy that converts visitors",
        backstory=LANDING_COPY_BACKSTORY,
        llm=get_llm(),
        verbose=True,
        allow_delegation=False,
    )
    
    task = Task(
        description=LANDING_COPY_PROMPT.format(
            value_prop=clarified.value_proposition,
            icp=positioning.icp,
            differentiators=positioning.differentiators,
        ),
        agent=agent,
        expected_output="Structured JSON with headline, subheadline, value_props, cta, pricing_tiers, and social_proof",
    )
    
    crew = Crew(agents=[agent], tasks=[task], verbose=True)
    result = crew.kickoff()
    
    data = parse_json_result(result)
    return LandingPage(**data)


async def run_bull_investor(dossier: StartupDossier) -> Dict[str, Any]:
    """Run bull investor agent."""
    agent = Agent(
        role="Bull Investor",
        goal="Make the strongest possible case for why this startup will succeed",
        backstory=BULL_INVESTOR_BACKSTORY,
        llm=get_llm(),
        verbose=True,
        allow_delegation=False,
    )
    
    task = Task(
        description=BULL_INVESTOR_PROMPT.format(
            market_summary=f"{len(dossier.market_research.competitors)} competitors found",
            positioning=dossier.positioning.positioning_statement,
            mvp_summary=f"{len(dossier.mvp_plan.features)} features planned",
        ),
        agent=agent,
        expected_output="Structured JSON with points, evidence, and conclusion",
    )
    
    crew = Crew(agents=[agent], tasks=[task], verbose=True)
    result = crew.kickoff()
    
    return parse_json_result(result)


async def run_skeptic_investor(dossier: StartupDossier) -> Dict[str, Any]:
    """Run skeptic investor agent."""
    agent = Agent(
        role="Skeptical Investor",
        goal="Identify all the risks and reasons this startup might fail",
        backstory=SKEPTIC_INVESTOR_BACKSTORY,
        llm=get_llm(),
        verbose=True,
        allow_delegation=False,
    )
    
    task = Task(
        description=SKEPTIC_INVESTOR_PROMPT.format(
            market_summary=f"{len(dossier.market_research.competitors)} competitors found",
            positioning=dossier.positioning.positioning_statement,
            mvp_summary=f"{len(dossier.mvp_plan.features)} features planned",
        ),
        agent=agent,
        expected_output="Structured JSON with points, evidence, and conclusion",
    )
    
    crew = Crew(agents=[agent], tasks=[task], verbose=True)
    result = crew.kickoff()
    
    return parse_json_result(result)


async def run_moderator(bull_args: Dict, skeptic_args: Dict) -> DebateSynthesis:
    """Run moderator agent."""
    agent = Agent(
        role="Investment Committee Moderator",
        goal="Synthesize bull and bear arguments into balanced insights",
        backstory=MODERATOR_BACKSTORY,
        llm=get_llm(),
        verbose=True,
        allow_delegation=False,
    )
    
    task = Task(
        description=MODERATOR_PROMPT.format(
            bull_case=json.dumps(bull_args),
            bear_case=json.dumps(skeptic_args),
        ),
        agent=agent,
        expected_output="Structured JSON with bull_points, skeptic_points, synthesis, mitigations, and key_risks",
    )
    
    crew = Crew(agents=[agent], tasks=[task], verbose=True)
    result = crew.kickoff()
    
    data = parse_json_result(result)
    return DebateSynthesis(**data)


async def run_finance(clarified: ClarifiedIdea, landing: LandingPage) -> FinanceModel:
    """Run finance agent."""
    numeric = get_numeric_client()
    template = await numeric.get_template()
    
    agent = Agent(
        role="Financial Analyst",
        goal="Build simple unit economics and financial assumptions",
        backstory=FINANCE_BACKSTORY,
        llm=get_llm(),
        verbose=True,
        allow_delegation=False,
    )
    
    task = Task(
        description=FINANCE_PROMPT.format(
            business_model=clarified.solution,
            pricing=landing.pricing_tiers[0] if landing.pricing_tiers else {},
            template=json.dumps(template),
        ),
        agent=agent,
        expected_output="Structured JSON with inputs, outputs, assumptions, and sensitivity_notes",
    )
    
    crew = Crew(agents=[agent], tasks=[task], verbose=True)
    result = crew.kickoff()
    
    data = parse_json_result(result)
    return FinanceModel(**data)


async def run_finalizer(dossier: StartupDossier) -> FinalReport:
    """Run finalizer agent."""
    agent = Agent(
        role="Startup Evaluator",
        goal="Provide a final GO/NO-GO/PIVOT recommendation with clear reasoning",
        backstory=FINALIZER_BACKSTORY,
        llm=get_llm(),
        verbose=True,
        allow_delegation=False,
    )
    
    summary = {
        "idea": dossier.clarified_idea.model_dump() if dossier.clarified_idea else {},
        "market": f"{len(dossier.market_research.competitors)} competitors" if dossier.market_research else "No data",
        "positioning": dossier.positioning.positioning_statement if dossier.positioning else "",
        "mvp": f"{len(dossier.mvp_plan.features)} features" if dossier.mvp_plan else "No plan",
        "debate": dossier.debate.synthesis if dossier.debate else "",
        "finance": dossier.finance.outputs.model_dump() if dossier.finance else {},
    }
    
    task = Task(
        description=FINALIZER_PROMPT.format(summary=json.dumps(summary)),
        agent=agent,
        expected_output="Structured JSON with recommendation, scorecard, key_insights, next_experiments, and go_to_market_summary",
    )
    
    crew = Crew(agents=[agent], tasks=[task], verbose=True)
    result = crew.kickoff()
    
    data = parse_json_result(result)
    return FinalReport(**data)


# High-Impact Feature Agents

async def run_competitive_matrix(dossier: StartupDossier) -> CompetitiveMatrix:
    """Generate competitive matrix."""
    agent = Agent(
        role="Competitive Analyst",
        goal="Create a visual competitive matrix showing feature comparison",
        backstory="You are a competitive intelligence expert who creates clear, visual comparisons.",
        llm=get_llm(),
        verbose=True,
        allow_delegation=False,
    )
    
    task = Task(
        description=COMPETITIVE_MATRIX_PROMPT.format(
            idea=dossier.clarified_idea.value_proposition if dossier.clarified_idea else "",
            competitors=[c.name for c in dossier.market_research.competitors[:5]] if dossier.market_research else [],
        ),
        agent=agent,
        expected_output="Structured JSON with headers, rows, and analysis",
    )
    
    crew = Crew(agents=[agent], tasks=[task], verbose=True)
    result = crew.kickoff()
    
    data = parse_json_result(result)
    return CompetitiveMatrix(**data)


async def run_assumption_tracker(dossier: StartupDossier) -> AssumptionTracker:
    """Extract and track risky assumptions."""
    agent = Agent(
        role="Risk Analyst",
        goal="Identify and categorize critical assumptions by risk type",
        backstory="You are a VC analyst who specializes in identifying hidden assumptions and risks.",
        llm=get_llm(),
        verbose=True,
        allow_delegation=False,
    )
    
    task = Task(
        description=ASSUMPTION_TRACKER_PROMPT.format(
            idea=dossier.clarified_idea.model_dump_json() if dossier.clarified_idea else "{}",
            market=f"{len(dossier.market_research.competitors)} competitors" if dossier.market_research else "No data",
            positioning=dossier.positioning.positioning_statement if dossier.positioning else "",
        ),
        agent=agent,
        expected_output="Structured JSON with assumptions, highest_risk, and summary",
    )
    
    crew = Crew(agents=[agent], tasks=[task], verbose=True)
    result = crew.kickoff()
    
    data = parse_json_result(result)
    return AssumptionTracker(**data)


async def run_validation_experiments(dossier: StartupDossier) -> List[ValidationExperiment]:
    """Generate specific validation experiments."""
    agent = Agent(
        role="Experimentation Designer",
        goal="Create actionable validation experiments with specific copy and scripts",
        backstory="You are a growth expert who designs lean experiments to test assumptions.",
        llm=get_llm(),
        verbose=True,
        allow_delegation=False,
    )
    
    assumptions = ""
    if dossier.assumption_tracker:
        assumptions = json.dumps([a.model_dump() for a in dossier.assumption_tracker.assumptions[:3]])
    
    task = Task(
        description=VALIDATION_EXPERIMENT_PROMPT.format(
            idea=dossier.clarified_idea.value_proposition if dossier.clarified_idea else "",
            assumptions=assumptions,
        ),
        agent=agent,
        expected_output="Structured JSON with name, description, landing_page_copy, cold_outreach_email, survey_questions, pricing_questions, and timeline",
    )
    
    crew = Crew(agents=[agent], tasks=[task], verbose=True)
    result = crew.kickoff()
    
    data = parse_json_result(result)
    # Handle both single experiment and list
    if isinstance(data, dict) and "name" in data:
        return [ValidationExperiment(**data)]
    elif isinstance(data, list):
        return [ValidationExperiment(**item) for item in data]
    return []


async def run_tam_estimate(dossier: StartupDossier) -> TAMEstimate:
    """Estimate market size (TAM/SAM/SOM)."""
    agent = Agent(
        role="Market Sizing Analyst",
        goal="Estimate market size with transparent reasoning",
        backstory="You are a market analyst who builds bottom-up market estimates.",
        llm=get_llm(),
        verbose=True,
        allow_delegation=False,
    )
    
    task = Task(
        description=TAM_ESTIMATE_PROMPT.format(
            idea=dossier.clarified_idea.value_proposition if dossier.clarified_idea else "",
            target=dossier.clarified_idea.target_customer if dossier.clarified_idea else "",
            market=f"{len(dossier.market_research.segments)} segments" if dossier.market_research else "No data",
        ),
        agent=agent,
        expected_output="Structured JSON with tam, sam, som, reasoning, and assumptions",
    )
    
    crew = Crew(agents=[agent], tasks=[task], verbose=True)
    result = crew.kickoff()
    
    data = parse_json_result(result)
    return TAMEstimate(**data)


async def run_destroy_analysis(dossier: StartupDossier) -> DestroyAnalysis:
    """Play devil's advocate - destroy the idea."""
    agent = Agent(
        role="Skeptical Devil's Advocate",
        goal="Attack the idea from every angle to find fatal flaws",
        backstory="You are a ruthless critic who has seen startups fail. You find the weaknesses.",
        llm=get_llm(),
        verbose=True,
        allow_delegation=False,
    )
    
    task = Task(
        description=DESTROY_ANALYSIS_PROMPT.format(
            idea=dossier.clarified_idea.model_dump_json() if dossier.clarified_idea else "{}",
            market=f"{len(dossier.market_research.competitors)} competitors" if dossier.market_research else "No data",
            positioning=dossier.positioning.positioning_statement if dossier.positioning else "",
        ),
        agent=agent,
        expected_output="Structured JSON with regulatory_risks, moat_weaknesses, churn_risks, distribution_challenges, survived, and reasoning",
    )
    
    crew = Crew(agents=[agent], tasks=[task], verbose=True)
    result = crew.kickoff()
    
    data = parse_json_result(result)
    return DestroyAnalysis(**data)


async def run_distribution_strategy(dossier: StartupDossier) -> DistributionStrategy:
    """Generate distribution strategy."""
    agent = Agent(
        role="Go-To-Market Strategist",
        goal="Create a specific distribution strategy with actionable channels",
        backstory="You are a GTM expert who has launched products. You know how to get first customers.",
        llm=get_llm(),
        verbose=True,
        allow_delegation=False,
    )
    
    task = Task(
        description=DISTRIBUTION_STRATEGY_PROMPT.format(
            idea=dossier.clarified_idea.value_proposition if dossier.clarified_idea else "",
            icp=dossier.positioning.icp if dossier.positioning else "",
            positioning=dossier.positioning.positioning_statement if dossier.positioning else "",
        ),
        agent=agent,
        expected_output="Structured JSON with top_channels, first_100_customers, cold_outreach_script, and community_strategy",
    )
    
    crew = Crew(agents=[agent], tasks=[task], verbose=True)
    result = crew.kickoff()
    
    data = parse_json_result(result)
    return DistributionStrategy(**data)


async def run_confidence_score(dossier: StartupDossier) -> ConfidenceScore:
    """Evaluate confidence in the analysis."""
    agent = Agent(
        role="Analysis Quality Evaluator",
        goal="Assess confidence in the analysis based on data quality and assumptions",
        backstory="You are a meta-analyst who evaluates the quality of analysis itself.",
        llm=get_llm(),
        verbose=True,
        allow_delegation=False,
    )
    
    analysis_summary = {
        "market_data_points": len(dossier.market_research.competitors) if dossier.market_research else 0,
        "citations": len(dossier.market_research.citations) if dossier.market_research else 0,
        "assumptions": len(dossier.clarified_idea.assumptions) if dossier.clarified_idea else 0,
    }
    
    task = Task(
        description=CONFIDENCE_SCORE_PROMPT.format(
            analysis=json.dumps(analysis_summary),
        ),
        agent=agent,
        expected_output="Structured JSON with overall_confidence, data_availability, source_quality, assumption_density, and reasoning",
    )
    
    crew = Crew(agents=[agent], tasks=[task], verbose=True)
    result = crew.kickoff()
    
    data = parse_json_result(result)
    return ConfidenceScore(**data)


async def store_market_graph(run_id: str, idea: str, market: MarketResearch, differentiators: list):
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


def parse_json_result(result: Any) -> Dict[str, Any]:
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
