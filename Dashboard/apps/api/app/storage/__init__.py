"""Storage backend abstraction."""
from .base import StorageBackend
from .local import LocalStorageBackend
from .aws import AWSStorageBackend


def get_storage_backend() -> StorageBackend:
    """Get the appropriate storage backend based on configuration."""
    from app.config import settings
    
    if settings.use_aws:
        return AWSStorageBackend()
    return LocalStorageBackend()


__all__ = ["StorageBackend", "get_storage_backend"]
