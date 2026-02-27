"""Local filesystem storage backend."""
import json
from pathlib import Path
from typing import List, Optional

from .base import StorageBackend
from app.models.dossier import StartupDossier


class LocalStorageBackend(StorageBackend):
    """Local filesystem storage."""
    
    def __init__(self, base_path: str = "./artifacts"):
        self.base_path = Path(base_path)
        self.runs_path = self.base_path / "runs"
        self.artifacts_path = self.base_path / "artifacts"
    
    async def initialize(self):
        """Create directories."""
        self.runs_path.mkdir(parents=True, exist_ok=True)
        self.artifacts_path.mkdir(parents=True, exist_ok=True)
    
    async def save_dossier(self, dossier: VentureDossier):
        """Save dossier as JSON file."""
        file_path = self.runs_path / f"{dossier.run_id}.json"
        with open(file_path, "w") as f:
            json.dump(dossier.model_dump(mode="json"), f, indent=2, default=str)
    
    async def get_dossier(self, run_id: str) -> Optional[VentureDossier]:
        """Load dossier from JSON file."""
        file_path = self.runs_path / f"{run_id}.json"
        if not file_path.exists():
            return None
        
        with open(file_path, "r") as f:
            data = json.load(f)
            return VentureDossier(**data)
    
    async def list_runs(self, limit: int = 20) -> List[dict]:
        """List recent runs."""
        runs = []
        for file_path in sorted(
            self.runs_path.glob("*.json"),
            key=lambda p: p.stat().st_mtime,
            reverse=True,
        )[:limit]:
            with open(file_path, "r") as f:
                data = json.load(f)
                runs.append({
                    "run_id": data["run_id"],
                    "idea_text": data.get("idea_text") or data.get("raw_idea"),
                    "status": data["status"],
                    "created_at": data["created_at"],
                })
        return runs
    
    async def save_artifact(self, run_id: str, filename: str, content: bytes):
        """Save artifact to filesystem."""
        run_dir = self.artifacts_path / run_id
        run_dir.mkdir(exist_ok=True)
        
        file_path = run_dir / filename
        with open(file_path, "wb") as f:
            f.write(content)
    
    async def get_artifact(self, run_id: str, filename: str) -> bytes:
        """Get artifact from filesystem."""
        file_path = self.artifacts_path / run_id / filename
        if not file_path.exists():
            raise FileNotFoundError(f"Artifact {filename} not found for run {run_id}")
        
        with open(file_path, "rb") as f:
            return f.read()
