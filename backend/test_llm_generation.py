import pytest
from unittest.mock import MagicMock, patch
from app.services.ai_service import generate_diagram_with_llm, generate_diagram_from_prompt
from app.models import Diagram

@patch("app.services.ai_service.OpenAI")
def test_generate_diagram_with_llm(mock_openai):
    # Mock the OpenAI client and response
    mock_client = MagicMock()
    mock_openai.return_value = mock_client
    
    mock_response = MagicMock()
    mock_response.choices[0].message.content = """
    {
        "nodes": [
            {
                "id": "1",
                "type": "Microservice",
                "data": {"label": "User Service", "type": "Microservice"},
                "position": {"x": 100, "y": 100}
            }
        ],
        "edges": [],
        "project_name": "test_project"
    }
    """
    mock_client.chat.completions.create.return_value = mock_response
    
    # Call the function
    diagram = generate_diagram_with_llm("test prompt", "web", "fake-key")
    
    # Verify
    assert isinstance(diagram, Diagram)
    assert len(diagram.nodes) == 1
    assert diagram.nodes[0].data["label"] == "User Service"
    assert diagram.project_name == "test_project"

def test_generate_diagram_heuristic_fallback():
    # Test that it falls back to heuristic when no API key is present
    with patch("app.services.ai_service.os.getenv", return_value=None):
        # We test generate_diagram_from_prompt which contains the fallback logic
        diagram = generate_diagram_from_prompt("create a web app with auth", "web")
        assert isinstance(diagram, Diagram)
        assert diagram.project_name == "ai_generated_project"
        
def test_generate_diagram_heuristic_integration():
    with patch("app.services.ai_service.os.getenv", return_value=None):
        diagram = generate_diagram_from_prompt("create a web app with auth", "web")
        
        # Check for expected heuristic nodes
        node_types = [n.type for n in diagram.nodes]
        assert "webapp" in node_types
        # Auth service is created with type "Microservice" -> "microservice"
        assert "microservice" in node_types 
        assert diagram.project_name == "ai_generated_project"
