"""Workflow runner that orchestrates the CrewAI agents."""
import logging
from datetime import datetime

from app.models.dossier import StartupDossier, RunStatus, AgentStep
from app.storage import get_storage_backend
from services.agents.crew import run_crew_workflow
from services.artifacts import generate_reports
from services.integrations.senso_client import get_senso_client

logger = logging.getLogger(__name__)


class WorkflowRunner:
    """Orchestrates the multi-agent workflow."""
    
    def __init__(self):
        self.storage = get_storage_backend()
        self.senso = get_senso_client()
    
    async def run(self, run_id: str, idea: str, functions: list = None):
        """Run the complete workflow."""
        try:
            logger.info(f"Starting workflow for run {run_id} with functions: {functions}")
            
            # Load dossier
            dossier = await self.storage.get_dossier(run_id)
            dossier.status = RunStatus.RUNNING
            await self.storage.save_dossier(dossier)
            
            # Run CrewAI workflow (this does all the agent orchestration)
            dossier = await run_crew_workflow(run_id, idea, dossier, self.storage, functions or [])
            
            # Generate reports
            await generate_reports(run_id, dossier, self.storage)
            
            # Index in Senso
            if self.senso.is_enabled():
                await self.senso.index_dossier(run_id, dossier)
            
            # Mark complete
            dossier.status = RunStatus.COMPLETED
            dossier.updated_at = datetime.utcnow()
            await self.storage.save_dossier(dossier)
            
            logger.info(f"Workflow completed for run {run_id}")
            
        except Exception as e:
            logger.error(f"Workflow error for run {run_id}: {e}", exc_info=True)
            dossier = await self.storage.get_dossier(run_id)
            dossier.status = RunStatus.FAILED
            dossier.error = str(e)
            await self.storage.save_dossier(dossier)
