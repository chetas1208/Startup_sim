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
    MARKET_RESEARCH = "market_research"
    COMPETITIVE_ANALYSIS = "competitive_analysis"
    STRATEGY = "strategy"


# --- Research Models ---

class Citation(BaseModel):
    url: str
    title: str
    snippet: str


class Competitor(BaseModel):
    name: str
    url: Optional[str] = None
    description: str
    strengths: List[str]
    weaknesses: List[str]
    pricing: Optional[str] = None
    citations: List[Citation] = []


# --- Agent Output Models ---

class ClarifiedIdea(BaseModel):
    target_customer: str
    core_problem: str
    proposed_solution: str
    key_assumptions: List[str]
    measurable_outcome: str


class MarketResearch(BaseModel):
    summary: str
    market_gaps: List[str]
    competitors: List[Competitor]
    citations: List[Citation]
    pdf_path: Optional[str] = None


class CompetitiveAnalysis(BaseModel):
    overlap_assessment: str
    differentiation_gaps: List[str]
    competitor_comparison: List[Dict[str, Any]]
    citations: List[Citation]
    pdf_path: Optional[str] = None


class StrategyPositioning(BaseModel):
    icp: str
    positioning_statement: str
    differentiation_angle: str
    strategic_focus: str
    pdf_path: Optional[str] = None


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


class ModifyRunRequest(BaseModel):
    assumptions: Optional[List[str]] = None
    target_segment: Optional[str] = None
    differentiation: Optional[str] = None


class GraphNode(BaseModel):
    id: str
    label: str
    type: str  # Idea, Segment, Competitor
    properties: Dict[str, Any] = {}


class GraphEdge(BaseModel):
    source: str
    target: str
    type: str  # TARGETS, SERVES, MENTIONED_IN


class GraphData(BaseModel):
    nodes: List[GraphNode]
    edges: List[GraphEdge]
