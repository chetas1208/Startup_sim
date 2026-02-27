"""API routes for simulation runs."""
import asyncio
import logging
from datetime import datetime
from typing import AsyncGenerator

from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from sse_starlette.sse import EventSourceResponse

from app.models.dossier import (
    CreateRunRequest,
    CreateRunResponse,
    StartupDossier,
    RunStatus,
    AskQuestionRequest,
    AskQuestionResponse,
)
from app.storage import get_storage_backend
from services.runner import WorkflowRunner

logger = logging.getLogger(__name__)
router = APIRouter()


@router.post("/runs", response_model=CreateRunResponse)
async def create_run(request: CreateRunRequest):
    """Start a new startup simulation run."""
    storage = get_storage_backend()
    
    # Create initial dossier
    run_id = storage.generate_run_id()
    dossier = StartupDossier(
        run_id=run_id,
        raw_idea=request.idea,
        selected_functions=request.functions,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow(),
        status=RunStatus.PENDING,
    )
    
    await storage.save_dossier(dossier)
    
    # Start workflow in background
    runner = WorkflowRunner()
    asyncio.create_task(runner.run(run_id, request.idea, request.functions))
    
    return CreateRunResponse(run_id=run_id, status=RunStatus.PENDING)


@router.get("/runs/{run_id}/events")
async def stream_events(run_id: str):
    """Stream SSE events for a run."""
    storage = get_storage_backend()
    
    async def event_generator() -> AsyncGenerator[dict, None]:
        """Generate SSE events."""
        last_update = None
        max_iterations = 600
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
                
                if dossier.updated_at != last_update:
                    yield {
                        "event": "update",
                        "data": dossier.model_dump_json(),
                    }
                    last_update = dossier.updated_at
                
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


@router.get("/runs/{run_id}")
async def get_run(run_id: str):
    """Get the full dossier for a run."""
    storage = get_storage_backend()
    dossier = await storage.get_dossier(run_id)
    
    if not dossier:
        raise HTTPException(status_code=404, detail="Run not found")
    
    return dossier


@router.get("/runs")
async def list_runs(limit: int = 20):
    """List recent runs."""
    storage = get_storage_backend()
    runs = await storage.list_runs(limit=limit)
    return {"runs": runs}


@router.get("/runs/{run_id}/artifact/{filename}")
async def download_artifact(run_id: str, filename: str):
    """Download an artifact (report.md or report.pdf)."""
    storage = get_storage_backend()
    
    try:
        content = await storage.get_artifact(run_id, filename)
        
        if filename.endswith(".md"):
            media_type = "text/markdown"
        elif filename.endswith(".pdf"):
            media_type = "application/pdf"
        else:
            media_type = "application/octet-stream"
        
        return StreamingResponse(
            iter([content]),
            media_type=media_type,
            headers={
                "Content-Disposition": f"attachment; filename={run_id}_{filename}"
            },
        )
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Artifact not found")


@router.post("/runs/{run_id}/ask", response_model=AskQuestionResponse)
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
