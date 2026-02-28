"""Configuration management."""
from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    # Environment
    environment: str = "development"
    log_level: str = "INFO"

    # API
    api_host: str = "0.0.0.0"
    api_port: int = 8000

    # LLM Provider — NVIDIA NIM (OpenAI-compatible)
    openai_api_key: str = ""
    openai_base_url: str = "https://integrate.api.nvidia.com/v1"
    llm_model: str = "moonshotai/kimi-k2.5"

    # Tavily
    tavily_api_key: str = ""

    # Database (optional — omit to use local JSON storage)
    database_url: Optional[str] = None

    class Config:
        env_file = "../../.env"
        case_sensitive = False
        extra = "ignore"


settings = Settings()
