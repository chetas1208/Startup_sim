"""Shared Pydantic models for VentureForge."""
from datetime import datetime
from enum import Enum
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field


class RunStatus(str, Enum):
    QUEUED = "queued"
    RUNNING = "running"
    DONE = "done"
    ERROR = "error"


class AgentStep(str, Enum):
    CLARIFIER = "clarifier"
    MARKET_SEARCH = "market_search"
    DEEP_EXTRACT = "deep_extract"
    NORMALIZE = "normalize"
    MARKET_SYNTHESIS = "market_synthesis"
    COMPETITIVE_ANALYSIS = "competitive_analysis"
    VC_INTERVIEW = "vc_interview"
    FUNDING_STRATEGY = "funding_strategy"


# --- Research Models ---

class Citation(BaseModel):
    url: str
    title: str = ""
    snippet: str = ""
    domain: str = ""


class Competitor(BaseModel):
    name: str
    url: Optional[str] = None
    description: str = ""
    strengths: List[str] = []
    weaknesses: List[str] = []
    pricing: Optional[str] = None
    segment: Optional[str] = None
    positioning: Optional[str] = None
    features: List[str] = []


# --- Agent Output Models ---

class ClarifiedIdea(BaseModel):
    idea_title: str = ""
    target_customer: str = ""
    core_problem: str = ""
    proposed_solution: str = ""
    key_assumptions: List[str] = []
    measurable_outcome: str = ""
    keywords: List[str] = []


class MarketResearch(BaseModel):
    summary: str = ""
    market_gaps: List[str] = []
    segments: List[str] = []
    competitors: List[Competitor] = []
    citations: List[Citation] = []


class CompetitiveAnalysis(BaseModel):
    competitive_summary: str = ""
    overlap_assessment: str = ""
    differentiation_opportunities: List[str] = []
    top_threats: List[str] = []
    competitor_comparison: List[Dict[str, Any]] = []
    citations: List[Citation] = []


class StrategyPositioning(BaseModel):
    icp: str = ""
    positioning_statement: str = ""
    differentiation_angle: str = ""
    strategic_focus: str = ""
    risks: List[str] = []
    recommended_next_steps: List[str] = []


class VCQuestion(BaseModel):
    question: str
    why_it_matters: str = ""
    answer: str = ""
    strength_score: int = 5


class VCInterview(BaseModel):
    questions: List[VCQuestion] = []
    vc_feedback: str = ""
    investment_risk_level: str = "Medium"


class FundingStrategy(BaseModel):
    recommended_funding_type: str = ""
    why: str = ""
    estimated_capital_needed: str = ""
    use_of_funds: List[str] = []
    milestones_for_next_round: List[str] = []


class Scorecard(BaseModel):
    overall_score: float = 0.0
    dimensions: List[Dict[str, Any]] = []
    recommendation: str = ""


# --- Run & Dossier ---

class VentureDossier(BaseModel):
    run_id: str
    idea_text: str
    status: RunStatus = RunStatus.QUEUED
    current_step: Optional[AgentStep] = None

    # Core outputs
    clarification: Optional[ClarifiedIdea] = None
    market_research: Optional[MarketResearch] = None
    competitive_analysis: Optional[CompetitiveAnalysis] = None
    strategy: Optional[StrategyPositioning] = None
    vc_interview: Optional[VCInterview] = None
    funding_strategy: Optional[FundingStrategy] = None
    scorecard: Optional[Scorecard] = None

    # Metadata
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    version_of: Optional[str] = None
    error: Optional[str] = None


# --- API Models ---

class CreateRunRequest(BaseModel):
    idea_text: str


class RunResponse(BaseModel):
    run_id: str
    status: RunStatus


class GraphNode(BaseModel):
    id: str
    label: str
    type: str
    properties: Dict[str, Any] = {}


class GraphEdge(BaseModel):
    source: str
    target: str
    type: str


class GraphData(BaseModel):
    nodes: List[GraphNode]
    edges: List[GraphEdge]
