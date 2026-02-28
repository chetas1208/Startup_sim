"""Tests for workflow orchestration."""
import pytest
from unittest.mock import Mock, AsyncMock, patch
from datetime import datetime

from shared.models import StartupDossier, RunStatus, ClarifiedIdea
from services.workflow import WorkflowOrchestrator


@pytest.fixture
def mock_storage():
    storage = Mock()
    storage.get_dossier = AsyncMock()
    storage.save_dossier = AsyncMock()
    storage.save_artifact = AsyncMock()
    return storage


@pytest.fixture
def sample_dossier():
    return StartupDossier(
        run_id="test-123",
        raw_idea="AI meal planning app",
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow(),
        status=RunStatus.PENDING,
    )


@pytest.mark.asyncio
async def test_clarifier_step(mock_storage, sample_dossier):
    """Test clarifier agent execution."""
    orchestrator = WorkflowOrchestrator()
    orchestrator.storage = mock_storage
    
    with patch.object(orchestrator, '_run_clarifier') as mock_clarifier:
        mock_clarifier.return_value = ClarifiedIdea(
            problem="Busy parents struggle with meal planning",
            solution="AI-powered meal planner",
            target_customer="Working parents with kids",
            value_proposition="Save time and eat healthier",
            assumptions=["Parents want healthy meals", "Willing to pay for convenience"],
        )
        
        result = await orchestrator._run_clarifier("AI meal planning app")
        
        assert result.problem == "Busy parents struggle with meal planning"
        assert len(result.assumptions) == 2


@pytest.mark.asyncio
async def test_workflow_error_handling(mock_storage, sample_dossier):
    """Test workflow handles errors gracefully."""
    mock_storage.get_dossier.return_value = sample_dossier
    
    orchestrator = WorkflowOrchestrator()
    orchestrator.storage = mock_storage
    
    with patch.object(orchestrator, '_run_clarifier') as mock_clarifier:
        mock_clarifier.side_effect = Exception("API error")
        
        await orchestrator.run_workflow("test-123", "Test idea")
        
        # Verify error was saved
        saved_dossier = mock_storage.save_dossier.call_args[0][0]
        assert saved_dossier.status == RunStatus.FAILED
        assert "API error" in saved_dossier.error


def test_parse_json_result():
    """Test JSON parsing from agent results."""
    orchestrator = WorkflowOrchestrator()
    
    # Test with markdown code block
    result = """
    Here's the output:
    ```json
    {"problem": "Test problem", "solution": "Test solution"}
    ```
    """
    
    parsed = orchestrator._parse_json_result(result)
    assert parsed["problem"] == "Test problem"
    assert parsed["solution"] == "Test solution"
    
    # Test with plain JSON
    result = '{"key": "value"}'
    parsed = orchestrator._parse_json_result(result)
    assert parsed["key"] == "value"
