"""FastAPI main application for VentureForge."""
import asyncio
import logging
import sys
import os
from contextlib import asynccontextmanager
from datetime import datetime
from typing import AsyncGenerator

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from sse_starlette.sse import EventSourceResponse

# Add project root to path so shared/ is importable
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "../.."))

from config import settings
from app.storage import get_storage_backend
from shared.models import (
    CreateRunRequest,
    RunResponse,
    VentureDossier,
    RunStatus,
    GraphData,
)

logging.basicConfig(level=settings.log_level)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifecycle management."""
    logger.info("VentureForge API starting up...")
    storage = get_storage_backend()
    await storage.initialize()
    yield
    logger.info("VentureForge API shutting down...")


app = FastAPI(
    title="VentureForge API",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {"name": "VentureForge API", "version": "1.0.0", "status": "running"}


@app.post("/api/runs", response_model=RunResponse)
async def create_run(request: CreateRunRequest):
    """Start a new VentureForge simulation run."""
    storage = get_storage_backend()

    run_id = storage.generate_run_id()
    dossier = VentureDossier(
        run_id=run_id,
        idea_text=request.idea_text,
        status=RunStatus.QUEUED,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow(),
    )
    await storage.save_dossier(dossier)

    # Start workflow in background
    from services.workflow import WorkflowOrchestrator
    orchestrator = WorkflowOrchestrator()
    asyncio.create_task(orchestrator.run_workflow(run_id, request.idea_text))

    return RunResponse(run_id=run_id, status=RunStatus.QUEUED)


@app.get("/api/runs/{run_id}/events")
async def stream_events(run_id: str):
    """Stream SSE events for a project run."""
    storage = get_storage_backend()

    async def event_generator() -> AsyncGenerator[dict, None]:
        last_step = None
        last_status = None

        while True:
            try:
                dossier = await storage.get_dossier(run_id)
                if not dossier:
                    yield {"event": "error", "data": '{"message": "Not found"}'}
                    break

                if dossier.current_step != last_step or dossier.status != last_status:
                    yield {
                        "event": "update",
                        "data": dossier.model_dump_json(),
                    }
                    last_step = dossier.current_step
                    last_status = dossier.status

                if dossier.status in [RunStatus.DONE, RunStatus.ERROR]:
                    yield {
                        "event": "complete",
                        "data": dossier.model_dump_json(),
                    }
                    break

                await asyncio.sleep(1.0)
            except Exception as e:
                logger.error(f"SSE Error: {e}")
                yield {"event": "error", "data": f'{{"message": "{str(e)}"}}'}
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


@app.get("/api/runs/{run_id}/graph", response_model=GraphData)
async def get_graph(run_id: str):
    """Get graph data for visualization."""
    storage = get_storage_backend()
    dossier = await storage.get_dossier(run_id)
    if not dossier:
        raise HTTPException(status_code=404, detail="Run not found")

    nodes = [{"id": "root", "label": dossier.clarification.idea_title if dossier.clarification else "Idea", "type": "Idea", "properties": {"text": dossier.idea_text}}]
    edges = []

    if dossier.market_research:
        for idx, comp in enumerate(dossier.market_research.competitors):
            nid = f"comp_{idx}"
            nodes.append({"id": nid, "label": comp.name, "type": "Competitor", "properties": {"description": comp.description}})
            edges.append({"source": "root", "target": nid, "type": "COMPETES_WITH"})

    return {"nodes": nodes, "edges": edges}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host=settings.api_host, port=settings.api_port)
