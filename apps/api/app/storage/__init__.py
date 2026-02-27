from .base import StorageBackend
from .local import LocalStorageBackend
from .postgres import PostgresStorageBackend


def get_storage_backend() -> StorageBackend:
    """Get the appropriate storage backend based on configuration."""
    from app.config import settings
    
    if settings.database_url:
        return PostgresStorageBackend(settings.database_url)
    return LocalStorageBackend()


__all__ = ["StorageBackend", "get_storage_backend"]
