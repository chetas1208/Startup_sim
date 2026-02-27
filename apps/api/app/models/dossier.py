"""SQLModel version of VentureForge models for Postgres persistence."""
from datetime import datetime
from typing import List, Optional, Dict, Any
from sqlmodel import SQLModel, Field, JSON, Column
from sqlalchemy import BigInteger, DateTime, String
from shared.models import RunStatus, AgentStep

# --- Core Tables ---

class Run(SQLModel, table=True):
    __tablename__ = "runs"
    
    id: str = Field(primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    idea_text: str
    status: RunStatus = Field(default=RunStatus.QUEUED)
    current_step: Optional[AgentStep] = None
    version_of: Optional[str] = None
    error: Optional[str] = None

class Dossier(SQLModel, table=True):
    __tablename__ = "dossiers"
    
    run_id: str = Field(primary_key=True, foreign_key="runs.id")
    # Store the entire complex structure as JSONB in Postgres
    data: Dict[str, Any] = Field(default_factory=dict, sa_column=Column(JSON))

class ResearchCitation(SQLModel, table=True):
    __tablename__ = "citations"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    run_id: str = Field(foreign_key="runs.id")
    # List of citation objects
    data: List[Dict[str, Any]] = Field(default_factory=list, sa_column=Column(JSON))

class Artifact(SQLModel, table=True):
    __tablename__ = "artifacts"
    
    run_id: str = Field(primary_key=True, foreign_key="runs.id")
    market_pdf_path: Optional[str] = None
    competition_pdf_path: Optional[str] = None
    strategy_pdf_path: Optional[str] = None
    market_md_path: Optional[str] = None
    competition_md_path: Optional[str] = None
    strategy_md_path: Optional[str] = None
