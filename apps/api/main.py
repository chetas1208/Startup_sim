"""FastAPI main application for VentureForge."""
import asyncio
import logging
from contextlib import asynccontextmanager
from datetime import datetime
from typing import AsyncGenerator, Dict, Any

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from sse_starlette.sse import EventSourceResponse

from app.config import settings
from services.workflow import WorkflowOrchestrator
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

# CORS - Using settings or unrestricted for hackathon
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # settings.cors_origins.split(",") if hasattr(settings, 'cors_origins') else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {
        "name": "VentureForge API",
        "version": "1.0.0",
        "status": "running",
    }


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
                
                # Check for updates in step or status
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
                
                await asyncio.sleep(1.5)
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


@app.get("/api/runs/{run_id}/pdf/{report_type}")
async def download_pdf(run_id: str, report_type: str):
    """Download specific strategic PDF reports."""
    storage = get_storage_backend()
    
    filename_map = {
        "market": "market_analysis.pdf",
        "competition": "competitive_analysis.pdf",
        "strategy": "strategy_positioning.pdf"
    }
    
    if report_type not in filename_map:
        raise HTTPException(status_code=400, detail="Invalid report type")
        
    filename = filename_map[report_type]
    try:
        content = await storage.get_artifact(run_id, filename)
        return StreamingResponse(
            iter([content]),
            media_type="application/pdf",
            headers={"Content-Disposition": f"attachment; filename={run_id}_{filename}"},
        )
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail=f"Report {report_type} not found")


@app.get("/api/runs/{run_id}/graph", response_model=GraphData)
async def get_graph(run_id: str):
    """Get graph data for visualization (from Neo4j or fallback)."""
    storage = get_storage_backend()
    dossier = await storage.get_dossier(run_id)
    if not dossier:
        raise HTTPException(status_code=404, detail="Run not found")
        
    # Logic to build graph from dossier data (Fallback)
    nodes = []
    edges = []
    
    # Root Node
    nodes.append({"id": "root", "label": "Startup Idea", "type": "Idea", "properties": {"text": dossier.idea_text}})
    
    if dossier.market_research:
        for idx, comp in enumerate(dossier.market_research.competitors):
            node_id = f"comp_{idx}"
            nodes.append({
                "id": node_id,
                "label": comp.name,
                "type": "Competitor",
                "properties": {"description": comp.description}
            })
            edges.append({"source": "root", "target": node_id, "type": "MENTIONED_IN"})
            
    # TODO: Add segments if available in future
    
    return {"nodes": nodes, "edges": edges}


if __name__ == "__main__":
    import uvicorn
    # Use config values if available
    host = getattr(settings, "api_host", "0.0.0.0")
    port = getattr(settings, "api_port", 8000)
    uvicorn.run(app, host=host, port=port)
