"""Shared Pydantic models for the startup simulation."""
from datetime import datetime
from enum import Enum
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field


class RunStatus(str, Enum):
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"


class AgentStep(str, Enum):
    CLARIFIER = "clarifier"
    MARKET_RESEARCH = "market_research"
    POSITIONING = "positioning"
    MVP_PLANNER = "mvp_planner"
    LANDING_COPY = "landing_copy"
    BULL_INVESTOR = "bull_investor"
    SKEPTIC_INVESTOR = "skeptic_investor"
    MODERATOR = "moderator"
    FINANCE = "finance"
    FINALIZER = "finalizer"


class Recommendation(str, Enum):
    GO = "GO"
    NO_GO = "NO_GO"
    PIVOT = "PIVOT"


# Agent Output Models

class ClarifiedIdea(BaseModel):
    problem: str
    solution: str
    target_customer: str
    value_proposition: str
    assumptions: List[str]


class Citation(BaseModel):
    url: str
    title: str
    snippet: str
    published_date: Optional[str] = None


class Competitor(BaseModel):
    name: str
    url: Optional[str] = None
    description: str
    strengths: List[str]
    weaknesses: List[str]
    pricing: Optional[str] = None
    citations: List[Citation] = []


class MarketSegment(BaseModel):
    name: str
    size_estimate: str
    characteristics: List[str]


class MarketResearch(BaseModel):
    competitors: List[Competitor]
    segments: List[MarketSegment]
    trends: List[str]
    citations: List[Citation]


class Positioning(BaseModel):
    icp: str  # Ideal Customer Profile
    positioning_statement: str
    differentiators: List[str]
    unique_value: str


class Feature(BaseModel):
    name: str
    description: str
    priority: str  # P0, P1, P2
    effort: str  # S, M, L, XL


class Milestone(BaseModel):
    week: int
    goal: str
    deliverables: List[str]


class MVPPlan(BaseModel):
    features: List[Feature]
    roadmap: List[Milestone]
    success_metrics: List[str]


class LandingPage(BaseModel):
    headline: str
    subheadline: str
    value_props: List[str]
    cta: str
    pricing_tiers: List[Dict[str, Any]]
    social_proof: str


class InvestorArgument(BaseModel):
    points: List[str]
    evidence: List[str]
    conclusion: str


class DebateSynthesis(BaseModel):
    bull_points: List[str]
    skeptic_points: List[str]
    synthesis: str
    mitigations: List[str]
    key_risks: List[str]


class FinancialInputs(BaseModel):
    cac: float  # Customer Acquisition Cost
    ltv: float  # Lifetime Value
    monthly_churn: float
    pricing: float
    unit_cost: float


class FinancialOutputs(BaseModel):
    ltv_cac_ratio: float
    payback_months: float
    gross_margin: float
    break_even_customers: int


class FinanceModel(BaseModel):
    inputs: FinancialInputs
    outputs: FinancialOutputs
    assumptions: List[str]
    sensitivity_notes: str


class Experiment(BaseModel):
    hypothesis: str
    test: str
    success_criteria: str
    timeline: str


class Scorecard(BaseModel):
    market_opportunity: int  # 1-10
    competitive_advantage: int
    execution_feasibility: int
    financial_viability: int
    overall_score: float
    reasoning: str


class FinalReport(BaseModel):
    recommendation: Recommendation
    scorecard: Scorecard
    key_insights: List[str]
    next_experiments: List[Experiment]
    go_to_market_summary: str


# Main Dossier

class StartupDossier(BaseModel):
    run_id: str
    raw_idea: str
    created_at: datetime
    updated_at: datetime
    
    # Agent outputs
    clarified_idea: Optional[ClarifiedIdea] = None
    market_research: Optional[MarketResearch] = None
    positioning: Optional[Positioning] = None
    mvp_plan: Optional[MVPPlan] = None
    landing_page: Optional[LandingPage] = None
    debate: Optional[DebateSynthesis] = None
    finance: Optional[FinanceModel] = None
    final_report: Optional[FinalReport] = None
    
    # Metadata
    provenance: Dict[str, Any] = Field(default_factory=dict)
    status: RunStatus = RunStatus.PENDING
    current_step: Optional[AgentStep] = None
    error: Optional[str] = None


# API Models

class CreateRunRequest(BaseModel):
    idea: str


class CreateRunResponse(BaseModel):
    run_id: str
    status: RunStatus


class StreamEvent(BaseModel):
    event: str
    step: Optional[AgentStep] = None
    message: str
    data: Optional[Dict[str, Any]] = None
    timestamp: datetime


class AskQuestionRequest(BaseModel):
    question: str


class AskQuestionResponse(BaseModel):
    answer: str
    sources: List[Citation]
