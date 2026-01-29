from unittest.mock import patch
from app.models import Diagram

def test_health_check(client):
    # We don't have a dedicated health endpoint yet, but 404 on root is a sign it's up
    response = client.get("/")
    assert response.status_code in [200, 404]

def test_generate_from_prompt_mocked(client):
    """
    Test the generation endpoint with a mocked AI service to avoid API calls.
    """
    mock_diagram = Diagram(
        nodes=[],
        edges=[],
        project_name="test_project"
    )
    
    with patch("app.api.routes.generate_diagram_from_prompt", return_value=mock_diagram):
        response = client.post("/generate-from-prompt", json={
            "prompt": "test prompt",
            "projectType": "web"
        })
        assert response.status_code == 200
        data = response.json()
        assert data["project_name"] == "test_project"

def test_global_exception_handler(client):
    """
    Test that the global exception handler catches errors and returns 500.
    """
    with patch("app.api.routes.generate_diagram_from_prompt", side_effect=Exception("Unexpected failure")):
        response = client.post("/generate-from-prompt", json={
            "prompt": "crash me",
            "projectType": "web"
        })
        assert response.status_code == 500
        data = response.json()
        assert data["error"] == "Internal Server Error"
