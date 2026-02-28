"""CrewAI task definitions."""
from crewai import Task
from typing import Dict, Any


def create_clarifier_task(agent, idea: str) -> Task:
    """Task to clarify the startup idea."""
    return Task(
        description=f"""Analyze this startup idea and structure it clearly:
        
        Idea: {idea}
        
        Provide:
        1. The core problem being solved
        2. The proposed solution
        3. Target customer description
        4. Value proposition
        5. Key assumptions that need validation
        
        Output as structured JSON matching the ClarifiedIdea schema.""",
        agent=agent,
        expected_output="Structured JSON with problem, solution, target_customer, value_proposition, and assumptions",
    )


def create_market_research_task(agent, clarified_idea: Dict[str, Any], search_tool) -> Task:
    """Task to conduct market research."""
    return Task(
        description=f"""Conduct comprehensive market research for this startup:
        
        Problem: {clarified_idea.get('problem')}
        Solution: {clarified_idea.get('solution')}
        Target: {clarified_idea.get('target_customer')}
        
        Use the search tool to find:
        1. Direct competitors (at least 5)
        2. Market segments and sizing
        3. Industry trends
        
        For each competitor, provide:
        - Name, URL, description
        - Key strengths and weaknesses
        - Pricing if available
        - Citations with URLs
        
        Output as structured JSON matching the MarketResearch schema.""",
        agent=agent,
        expected_output="Structured JSON with competitors, segments, trends, and citations",
        tools=[search_tool] if search_tool else [],
    )


def create_positioning_task(agent, context: Dict[str, Any]) -> Task:
    """Task to define positioning."""
    return Task(
        description=f"""Define positioning and differentiation strategy:
        
        Idea: {context.get('clarified_idea')}
        Competitors: {context.get('competitors_summary')}
        
        Provide:
        1. Ideal Customer Profile (ICP) - be specific
        2. Positioning statement (one sentence)
        3. Key differentiators (3-5 points)
        4. Unique value proposition
        
        Output as structured JSON matching the Positioning schema.""",
        agent=agent,
        expected_output="Structured JSON with icp, positioning_statement, differentiators, and unique_value",
    )


def create_mvp_task(agent, context: Dict[str, Any]) -> Task:
    """Task to plan MVP."""
    return Task(
        description=f"""Design a lean MVP with a 4-week roadmap:
        
        Solution: {context.get('solution')}
        Value Prop: {context.get('value_proposition')}
        Differentiators: {context.get('differentiators')}
        
        Provide:
        1. Core features (8-12 features) with priority (P0/P1/P2) and effort (S/M/L/XL)
        2. 4-week roadmap with weekly milestones
        3. Success metrics to track
        
        Focus on the minimum viable product that delivers core value.
        
        Output as structured JSON matching the MVPPlan schema.""",
        agent=agent,
        expected_output="Structured JSON with features, roadmap, and success_metrics",
    )


def create_landing_copy_task(agent, context: Dict[str, Any]) -> Task:
    """Task to write landing page copy."""
    return Task(
        description=f"""Write compelling landing page copy:
        
        Value Prop: {context.get('value_proposition')}
        ICP: {context.get('icp')}
        Differentiators: {context.get('differentiators')}
        
        Provide:
        1. Headline (10 words max)
        2. Subheadline (20 words max)
        3. Value propositions (3-5 bullet points)
        4. Call-to-action text
        5. Pricing tiers (3 tiers with name, price, features)
        6. Social proof placeholder text
        
        Output as structured JSON matching the LandingPage schema.""",
        agent=agent,
        expected_output="Structured JSON with headline, subheadline, value_props, cta, pricing_tiers, and social_proof",
    )


def create_bull_task(agent, context: Dict[str, Any]) -> Task:
    """Task for bull investor argument."""
    return Task(
        description=f"""Make the strongest bull case for this startup:
        
        Market: {context.get('market_summary')}
        Positioning: {context.get('positioning')}
        MVP: {context.get('mvp_summary')}
        
        Argue why this startup will succeed. Provide:
        1. Key bull points (5-7 arguments)
        2. Supporting evidence for each
        3. Conclusion on upside potential
        
        Be optimistic but grounded in the analysis.
        
        Output as structured JSON matching the InvestorArgument schema.""",
        agent=agent,
        expected_output="Structured JSON with points, evidence, and conclusion",
    )


def create_skeptic_task(agent, context: Dict[str, Any]) -> Task:
    """Task for skeptic investor argument."""
    return Task(
        description=f"""Identify all risks and reasons this startup might fail:
        
        Market: {context.get('market_summary')}
        Positioning: {context.get('positioning')}
        MVP: {context.get('mvp_summary')}
        
        Challenge the assumptions. Provide:
        1. Key skeptic points (5-7 concerns)
        2. Evidence or reasoning for each
        3. Conclusion on downside risks
        
        Be critical but fair.
        
        Output as structured JSON matching the InvestorArgument schema.""",
        agent=agent,
        expected_output="Structured JSON with points, evidence, and conclusion",
    )


def create_moderator_task(agent, bull_args: Dict, skeptic_args: Dict) -> Task:
    """Task to synthesize debate."""
    return Task(
        description=f"""Synthesize the bull and bear arguments:
        
        Bull Case: {bull_args}
        Bear Case: {skeptic_args}
        
        Provide:
        1. Summary of bull points (3-5 key arguments)
        2. Summary of skeptic points (3-5 key concerns)
        3. Balanced synthesis (2-3 paragraphs)
        4. Risk mitigations (3-5 strategies)
        5. Key risks to monitor
        
        Output as structured JSON matching the DebateSynthesis schema.""",
        agent=agent,
        expected_output="Structured JSON with bull_points, skeptic_points, synthesis, mitigations, and key_risks",
    )


def create_finance_task(agent, context: Dict[str, Any], template: Dict) -> Task:
    """Task to build financial model."""
    return Task(
        description=f"""Build simple unit economics for this startup:
        
        Business Model: {context.get('business_model')}
        Pricing: {context.get('pricing')}
        Template: {template}
        
        Provide reasonable assumptions and calculate:
        1. Inputs: CAC, LTV, monthly churn, pricing, unit cost
        2. Outputs: LTV/CAC ratio, payback months, gross margin, break-even customers
        3. List of assumptions made
        4. Sensitivity notes (what could change these numbers)
        
        Use the template benchmarks as guidance.
        
        Output as structured JSON matching the FinanceModel schema.""",
        agent=agent,
        expected_output="Structured JSON with inputs, outputs, assumptions, and sensitivity_notes",
    )


def create_finalizer_task(agent, dossier_summary: Dict[str, Any]) -> Task:
    """Task to create final recommendation."""
    return Task(
        description=f"""Provide final GO/NO-GO/PIVOT recommendation:
        
        Full Analysis: {dossier_summary}
        
        Provide:
        1. Scorecard (1-10 scores for market_opportunity, competitive_advantage, 
           execution_feasibility, financial_viability, plus overall score and reasoning)
        2. Recommendation: GO, NO_GO, or PIVOT
        3. Key insights (5-7 bullet points)
        4. Next experiments (3-5 concrete tests with hypothesis, test, success criteria, timeline)
        5. Go-to-market summary (2-3 paragraphs)
        
        Output as structured JSON matching the FinalReport schema.""",
        agent=agent,
        expected_output="Structured JSON with recommendation, scorecard, key_insights, next_experiments, and go_to_market_summary",
    )
