"""FastAPI main application."""
import asyncio
import logging
from contextlib import asynccontextmanager
from datetime import datetime
from typing import AsyncGenerator

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, FileResponse
from sse_starlette.sse import EventSourceResponse

from config import settings
from services.workflow import WorkflowOrchestrator
from services.storage import get_storage_backend
from shared.models import (
    CreateRunRequest,
    CreateRunResponse,
    StartupDossier,
    RunStatus,
    AskQuestionRequest,
    AskQuestionResponse,
)

logging.basicConfig(level=settings.log_level)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifecycle management."""
    logger.info("Starting up...")
    storage = get_storage_backend()
    await storage.initialize()
    yield
    logger.info("Shutting down...")


app = FastAPI(
    title="Startup Sim Agent API",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins.split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {
        "name": "Startup Sim Agent API",
        "version": "1.0.0",
        "status": "running",
    }


@app.post("/api/runs", response_model=CreateRunResponse)
async def create_run(request: CreateRunRequest):
    """Start a new startup simulation run."""
    storage = get_storage_backend()
    
    # Create initial dossier
    run_id = storage.generate_run_id()
    dossier = StartupDossier(
        run_id=run_id,
        raw_idea=request.idea,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow(),
        status=RunStatus.PENDING,
    )
    
    await storage.save_dossier(dossier)
    
    # Start workflow in background
    orchestrator = WorkflowOrchestrator()
    asyncio.create_task(orchestrator.run_workflow(run_id, request.idea))
    
    return CreateRunResponse(run_id=run_id, status=RunStatus.PENDING)


@app.get("/api/runs/{run_id}/events")
async def stream_events(run_id: str):
    """Stream SSE events for a run."""
    storage = get_storage_backend()
    
    async def event_generator() -> AsyncGenerator[dict, None]:
        """Generate SSE events."""
        last_update = None
        max_iterations = 600  # 10 minutes max
        iteration = 0
        
        while iteration < max_iterations:
            try:
                dossier = await storage.get_dossier(run_id)
                if not dossier:
                    yield {
                        "event": "error",
                        "data": '{"message": "Run not found"}',
                    }
                    break
                
                # Send update if changed
                if dossier.updated_at != last_update:
                    yield {
                        "event": "update",
                        "data": dossier.model_dump_json(),
                    }
                    last_update = dossier.updated_at
                
                # Check if completed
                if dossier.status in [RunStatus.COMPLETED, RunStatus.FAILED]:
                    yield {
                        "event": "complete",
                        "data": dossier.model_dump_json(),
                    }
                    break
                
                await asyncio.sleep(1)
                iteration += 1
                
            except Exception as e:
                logger.error(f"Error streaming events: {e}")
                yield {
                    "event": "error",
                    "data": f'{{"message": "{str(e)}"}}',
                }
                break
    
    return EventSourceResponse(event_generator())


@app.get("/api/runs/{run_id}")
async def get_run(run_id: str):
    """Get the full dossier for a run."""
    storage = get_storage_backend()
    dossier = await storage.get_dossier(run_id)
    
    if not dossier:
        raise HTTPException(status_code=404, detail="Run not found")
    
    return dossier


@app.get("/api/runs")
async def list_runs(limit: int = 20):
    """List recent runs."""
    storage = get_storage_backend()
    runs = await storage.list_runs(limit=limit)
    return {"runs": runs}


@app.get("/api/runs/{run_id}/artifact/report.md")
async def download_markdown(run_id: str):
    """Download the markdown report."""
    storage = get_storage_backend()
    
    try:
        content = await storage.get_artifact(run_id, "report.md")
        return StreamingResponse(
            iter([content]),
            media_type="text/markdown",
            headers={
                "Content-Disposition": f"attachment; filename={run_id}_report.md"
            },
        )
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Report not found")


@app.get("/api/runs/{run_id}/artifact/report.pdf")
async def download_pdf(run_id: str):
    """Download the PDF report."""
    storage = get_storage_backend()
    
    try:
        content = await storage.get_artifact(run_id, "report.pdf")
        return StreamingResponse(
            iter([content]),
            media_type="application/pdf",
            headers={
                "Content-Disposition": f"attachment; filename={run_id}_report.pdf"
            },
        )
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Report not found")


@app.post("/api/runs/{run_id}/ask", response_model=AskQuestionResponse)
async def ask_question(run_id: str, request: AskQuestionRequest):
    """Ask a question about the dossier using RAG (if Senso enabled)."""
    from services.integrations.senso_client import get_senso_client
    
    senso = get_senso_client()
    if not senso.is_enabled():
        raise HTTPException(
            status_code=501,
            detail="Senso RAG not configured. Set SENSO_API_KEY to enable.",
        )
    
    storage = get_storage_backend()
    dossier = await storage.get_dossier(run_id)
    
    if not dossier:
        raise HTTPException(status_code=404, detail="Run not found")
    
    answer = await senso.ask_question(run_id, request.question, dossier)
    return answer


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host=settings.api_host, port=settings.api_port)
