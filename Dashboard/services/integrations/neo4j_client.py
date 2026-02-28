"""Neo4j graph database client."""
from typing import List, Dict, Any
from neo4j import GraphDatabase, AsyncGraphDatabase
from neo4j.exceptions import ServiceUnavailable

from config import settings


class Neo4jClient:
    """Neo4j client for market graph."""
    
    def __init__(self):
        self.uri = settings.neo4j_uri
        self.user = settings.neo4j_user
        self.password = settings.neo4j_password
        self.driver = None
    
    async def connect(self):
        """Connect to Neo4j."""
        try:
            self.driver = AsyncGraphDatabase.driver(
                self.uri,
                auth=(self.user, self.password),
            )
            await self.driver.verify_connectivity()
        except ServiceUnavailable:
            print("Warning: Neo4j not available, graph features disabled")
            self.driver = None
    
    async def close(self):
        """Close connection."""
        if self.driver:
            await self.driver.close()
    
    async def initialize_schema(self):
        """Create indexes and constraints."""
        if not self.driver:
            return
        
        queries = [
            "CREATE CONSTRAINT IF NOT EXISTS FOR (i:Idea) REQUIRE i.run_id IS UNIQUE",
            "CREATE CONSTRAINT IF NOT EXISTS FOR (c:Competitor) REQUIRE c.name IS UNIQUE",
            "CREATE INDEX IF NOT EXISTS FOR (s:Segment) ON (s.name)",
            "CREATE INDEX IF NOT EXISTS FOR (f:Feature) ON (f.name)",
        ]
        
        async with self.driver.session() as session:
            for query in queries:
                try:
                    await session.run(query)
                except Exception as e:
                    print(f"Schema creation warning: {e}")
    
    async def store_market_graph(
        self,
        run_id: str,
        idea: str,
        competitors: List[Dict[str, Any]],
        segments: List[Dict[str, Any]],
        differentiators: List[str],
    ):
        """Store market research as a graph."""
        if not self.driver:
            return
        
        async with self.driver.session() as session:
            # Create Idea node
            await session.run(
                """
                MERGE (i:Idea {run_id: $run_id})
                SET i.description = $idea, i.updated_at = datetime()
                """,
                run_id=run_id,
                idea=idea,
            )
            
            # Create Segment nodes
            for segment in segments:
                await session.run(
                    """
                    MERGE (s:Segment {name: $name})
                    SET s.size_estimate = $size_estimate
                    WITH s
                    MATCH (i:Idea {run_id: $run_id})
                    MERGE (i)-[:TARGETS]->(s)
                    """,
                    name=segment["name"],
                    size_estimate=segment.get("size_estimate", ""),
                    run_id=run_id,
                )
            
            # Create Competitor nodes and relationships
            for comp in competitors:
                await session.run(
                    """
                    MERGE (c:Competitor {name: $name})
                    SET c.description = $description,
                        c.url = $url,
                        c.pricing = $pricing
                    """,
                    name=comp["name"],
                    description=comp.get("description", ""),
                    url=comp.get("url", ""),
                    pricing=comp.get("pricing", ""),
                )
                
                # Link competitors to segments (simplified)
                for segment in segments:
                    await session.run(
                        """
                        MATCH (c:Competitor {name: $comp_name})
                        MATCH (s:Segment {name: $seg_name})
                        MERGE (c)-[:SERVES]->(s)
                        """,
                        comp_name=comp["name"],
                        seg_name=segment["name"],
                    )
                
                # Store features
                for strength in comp.get("strengths", [])[:3]:
                    await session.run(
                        """
                        MERGE (f:Feature {name: $feature})
                        WITH f
                        MATCH (c:Competitor {name: $comp_name})
                        MERGE (c)-[:HAS_FEATURE]->(f)
                        """,
                        feature=strength,
                        comp_name=comp["name"],
                    )
            
            # Store differentiators
            for diff in differentiators:
                await session.run(
                    """
                    MERGE (d:Differentiator {name: $name})
                    WITH d
                    MATCH (i:Idea {run_id: $run_id})
                    MERGE (i)-[:DIFFERS_ON]->(d)
                    """,
                    name=diff,
                    run_id=run_id,
                )
    
    async def get_top_competitors(self, run_id: str, limit: int = 5) -> List[Dict[str, Any]]:
        """Get top competitors by feature overlap."""
        if not self.driver:
            return []
        
        async with self.driver.session() as session:
            result = await session.run(
                """
                MATCH (i:Idea {run_id: $run_id})-[:TARGETS]->(s:Segment)<-[:SERVES]-(c:Competitor)
                OPTIONAL MATCH (c)-[:HAS_FEATURE]->(f:Feature)
                WITH c, count(DISTINCT s) as segment_overlap, collect(DISTINCT f.name) as features
                RETURN c.name as name, c.description as description, 
                       segment_overlap, features
                ORDER BY segment_overlap DESC
                LIMIT $limit
                """,
                run_id=run_id,
                limit=limit,
            )
            
            competitors = []
            async for record in result:
                competitors.append({
                    "name": record["name"],
                    "description": record["description"],
                    "segment_overlap": record["segment_overlap"],
                    "features": record["features"],
                })
            
            return competitors


_client = None


async def get_neo4j_client() -> Neo4jClient:
    """Get Neo4j client singleton."""
    global _client
    if _client is None:
        _client = Neo4jClient()
        await _client.connect()
        await _client.initialize_schema()
    return _client
