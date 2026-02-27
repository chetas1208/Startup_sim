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
    cors_origins: str = "http://localhost:5173,http://localhost:3000"
    
    # OpenAI (Required)
    openai_api_key: str
    
    # Tavily (Required)
    tavily_api_key: str
    
    # Neo4j
    neo4j_uri: str = "bolt://localhost:7687"
    neo4j_user: str = "neo4j"
    neo4j_password: str = "password"
    
    # AWS
    aws_access_key_id: Optional[str] = None
    aws_secret_access_key: Optional[str] = None
    aws_region: str = "us-east-1"
    aws_s3_bucket: Optional[str] = None
    aws_dynamodb_table: Optional[str] = None
    
    # Optional integrations
    yutori_api_key: Optional[str] = None
    senso_api_key: Optional[str] = None
    modulate_api_key: Optional[str] = None
    numeric_api_key: Optional[str] = None
    
    @property
    def is_production(self) -> bool:
        return self.environment == "production"
    
    @property
    def use_aws(self) -> bool:
        return bool(self.aws_access_key_id and self.aws_s3_bucket)
    
    class Config:
        env_file = ".env"
        case_sensitive = False


settings = Settings()
