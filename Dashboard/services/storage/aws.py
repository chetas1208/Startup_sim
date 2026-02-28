"""AWS storage backend (DynamoDB + S3)."""
import json
from typing import List, Optional
from datetime import datetime

import boto3
from botocore.exceptions import ClientError

from .base import StorageBackend
from shared.models import StartupDossier
from config import settings


class AWSStorageBackend(StorageBackend):
    """AWS DynamoDB + S3 storage."""
    
    def __init__(self):
        self.dynamodb = boto3.resource(
            "dynamodb",
            region_name=settings.aws_region,
            aws_access_key_id=settings.aws_access_key_id,
            aws_secret_access_key=settings.aws_secret_access_key,
        )
        self.s3 = boto3.client(
            "s3",
            region_name=settings.aws_region,
            aws_access_key_id=settings.aws_access_key_id,
            aws_secret_access_key=settings.aws_secret_access_key,
        )
        self.table_name = settings.aws_dynamodb_table
        self.bucket_name = settings.aws_s3_bucket
    
    async def initialize(self):
        """Verify AWS resources exist."""
        try:
            self.table = self.dynamodb.Table(self.table_name)
            self.table.load()
        except ClientError as e:
            if e.response["Error"]["Code"] == "ResourceNotFoundException":
                # Create table if it doesn't exist
                self.table = self.dynamodb.create_table(
                    TableName=self.table_name,
                    KeySchema=[
                        {"AttributeName": "run_id", "KeyType": "HASH"},
                    ],
                    AttributeDefinitions=[
                        {"AttributeName": "run_id", "AttributeType": "S"},
                        {"AttributeName": "created_at", "AttributeType": "S"},
                    ],
                    GlobalSecondaryIndexes=[
                        {
                            "IndexName": "created_at-index",
                            "KeySchema": [
                                {"AttributeName": "created_at", "KeyType": "HASH"},
                            ],
                            "Projection": {"ProjectionType": "ALL"},
                            "ProvisionedThroughput": {
                                "ReadCapacityUnits": 5,
                                "WriteCapacityUnits": 5,
                            },
                        }
                    ],
                    BillingMode="PAY_PER_REQUEST",
                )
                self.table.wait_until_exists()
    
    async def save_dossier(self, dossier: StartupDossier):
        """Save dossier to DynamoDB."""
        item = json.loads(dossier.model_dump_json())
        self.table.put_item(Item=item)
    
    async def get_dossier(self, run_id: str) -> Optional[StartupDossier]:
        """Get dossier from DynamoDB."""
        try:
            response = self.table.get_item(Key={"run_id": run_id})
            if "Item" in response:
                return StartupDossier(**response["Item"])
            return None
        except ClientError:
            return None
    
    async def list_runs(self, limit: int = 20) -> List[dict]:
        """List recent runs from DynamoDB."""
        try:
            response = self.table.scan(Limit=limit)
            items = response.get("Items", [])
            
            # Sort by created_at
            items.sort(key=lambda x: x.get("created_at", ""), reverse=True)
            
            return [
                {
                    "run_id": item["run_id"],
                    "raw_idea": item["raw_idea"],
                    "status": item["status"],
                    "created_at": item["created_at"],
                }
                for item in items[:limit]
            ]
        except ClientError:
            return []
    
    async def save_artifact(self, run_id: str, filename: str, content: bytes):
        """Save artifact to S3."""
        key = f"{run_id}/{filename}"
        self.s3.put_object(
            Bucket=self.bucket_name,
            Key=key,
            Body=content,
            ContentType=self._get_content_type(filename),
        )
    
    async def get_artifact(self, run_id: str, filename: str) -> bytes:
        """Get artifact from S3."""
        key = f"{run_id}/{filename}"
        try:
            response = self.s3.get_object(Bucket=self.bucket_name, Key=key)
            return response["Body"].read()
        except ClientError as e:
            if e.response["Error"]["Code"] == "NoSuchKey":
                raise FileNotFoundError(f"Artifact {filename} not found for run {run_id}")
            raise
    
    def _get_content_type(self, filename: str) -> str:
        """Get content type from filename."""
        if filename.endswith(".md"):
            return "text/markdown"
        elif filename.endswith(".pdf"):
            return "application/pdf"
        elif filename.endswith(".json"):
            return "application/json"
        return "application/octet-stream"
