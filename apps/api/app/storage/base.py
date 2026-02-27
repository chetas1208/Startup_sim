"""Base storage interface."""
from abc import ABC, abstractmethod
from typing import List, Optional
import uuid

from shared.models import VentureDossier


class StorageBackend(ABC):
    """Abstract storage backend."""
    
    @abstractmethod
    async def initialize(self):
        """Initialize the storage backend."""
        pass
    
    @abstractmethod
    async def save_dossier(self, dossier: VentureDossier):
        """Save a dossier."""
        pass
    
    @abstractmethod
    async def get_dossier(self, run_id: str) -> Optional[VentureDossier]:
        """Get a dossier by run_id."""
        pass
    
    @abstractmethod
    async def list_runs(self, limit: int = 20) -> List[dict]:
        """List recent runs."""
        pass
    
    @abstractmethod
    async def save_artifact(self, run_id: str, filename: str, content: bytes):
        """Save an artifact (report, etc.)."""
        pass
    
    @abstractmethod
    async def get_artifact(self, run_id: str, filename: str) -> bytes:
        """Get an artifact."""
        pass
    
    def generate_run_id(self) -> str:
        """Generate a unique run ID."""
        return str(uuid.uuid4())
