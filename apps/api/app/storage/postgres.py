"""PostgreSQL storage backend using SQLModel."""
import json
import logging
from typing import List, Optional
from datetime import datetime

from sqlmodel import Session, create_engine, select, SQLModel
from sqlalchemy.orm import sessionmaker

from app.config import settings
from .base import StorageBackend
from shared.models import VentureDossier, RunStatus
from app.models.dossier import Run, Dossier, ResearchCitation, Artifact

logger = logging.getLogger(__name__)


class PostgresStorageBackend(StorageBackend):
    """PostgreSQL storage backend."""
    
    def __init__(self, db_url: str):
        self.engine = create_engine(db_url)
        self.SessionLocal = sessionmaker(
            autocommit=False, autoflush=False, bind=self.engine, class_=Session
        )
    
    async def initialize(self):
        """Create tables if they don't exist."""
        try:
            SQLModel.metadata.create_all(self.engine)
            logger.info("Postgres tables initialized.")
        except Exception as e:
            logger.error(f"Failed to initialize Postgres: {e}")
            raise
    
    async def save_dossier(self, dossier: VentureDossier):
        """Save or update a dossier in Postgres."""
        with self.SessionLocal() as session:
            # 1. Update Run
            run = session.get(Run, dossier.run_id)
            if not run:
                run = Run(
                    id=dossier.run_id,
                    idea_text=dossier.idea_text,
                    created_at=dossier.created_at,
                    version_of=dossier.version_of
                )
                session.add(run)
            
            run.status = dossier.status
            run.current_step = dossier.current_step
            run.updated_at = datetime.utcnow()
            run.error = dossier.error
            
            # 2. Update Dossier JSON
            db_dossier = session.get(Dossier, dossier.run_id)
            if not db_dossier:
                db_dossier = Dossier(run_id=dossier.run_id)
                session.add(db_dossier)
            
            db_dossier.data = dossier.model_dump(mode="json")
            
            # 3. Update Citations if present
            citations_list = []
            if dossier.market_research:
                citations_list.extend([c.model_dump(mode="json") for c in dossier.market_research.citations])
            if dossier.competitive_analysis:
                citations_list.extend([c.model_dump(mode="json") for c in dossier.competitive_analysis.citations])
            
            if citations_list:
                db_citations = session.exec(select(ResearchCitation).where(ResearchCitation.run_id == dossier.run_id)).first()
                if not db_citations:
                    db_citations = ResearchCitation(run_id=dossier.run_id)
                    session.add(db_citations)
                db_citations.data = citations_list

            session.commit()

    async def get_dossier(self, run_id: str) -> Optional[VentureDossier]:
        """Load dossier from Postgres."""
        with self.SessionLocal() as session:
            db_dossier = session.get(Dossier, run_id)
            if not db_dossier:
                # Try to get from Run if dossier record not yet created
                run = session.get(Run, run_id)
                if not run:
                    return None
                return VentureDossier(
                    run_id=run.id,
                    idea_text=run.idea_text,
                    status=run.status,
                    created_at=run.created_at
                )
            
            return VentureDossier(**db_dossier.data)
    
    async def list_runs(self, limit: int = 20) -> List[dict]:
        """List recent runs."""
        with self.SessionLocal() as session:
            statement = select(Run).order_by(Run.created_at.desc()).limit(limit)
            results = session.exec(statement).all()
            return [
                {
                    "run_id": r.id,
                    "idea_text": r.idea_text,
                    "status": r.status,
                    "created_at": r.created_at,
                }
                for r in results
            ]
    
    async def save_artifact(self, run_id: str, filename: str, content: bytes):
        """Save artifact path to DB (binary content should be handled by another service or stored as file)."""
        # For this requirement, we'll store PDFs on filesystem but keep paths in DB
        import os
        from app.config import settings
        
        storage_dir = os.path.join(settings.pdf_storage_path, run_id)
        os.makedirs(storage_dir, exist_ok=True)
        
        file_path = os.path.join(storage_dir, filename)
        with open(file_path, "wb") as f:
            f.write(content)
            
        with self.SessionLocal() as session:
            art = session.get(Artifact, run_id)
            if not art:
                art = Artifact(run_id=run_id)
                session.add(art)
                
            if "market" in filename.lower() and filename.endswith(".pdf"):
                art.market_pdf_path = file_path
            elif "competition" in filename.lower() and filename.endswith(".pdf"):
                art.competition_pdf_path = file_path
            elif "strategy" in filename.lower() and filename.endswith(".pdf"):
                art.strategy_pdf_path = file_path
            
            session.commit()
    
    async def get_artifact(self, run_id: str, filename: str) -> bytes:
        """Get artifact from filesystem."""
        # Implementation depends on save_artifact logic
        import os
        from app.config import settings
        file_path = os.path.join(settings.pdf_storage_path, run_id, filename)
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"Artifact {filename} not found for run {run_id}")
        
        with open(file_path, "rb") as f:
            return f.read()
