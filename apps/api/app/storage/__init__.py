from .base import StorageBackend
from .local import LocalStorageBackend


def get_storage_backend() -> StorageBackend:
    """Get the appropriate storage backend. Uses local JSON storage."""
    return LocalStorageBackend()


__all__ = ["StorageBackend", "get_storage_backend"]
