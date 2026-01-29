import sys
import os
import shutil

# Add backend to path
sys.path.append(os.path.join(os.getcwd(), 'backend'))

from app.services.generator import generate_project
from app.models import Diagram, Node, Edge

def test_cloud_db_generation():
    # Setup
    project_name = "test_cloud_db_project"
    
    # Create Nodes
    service_node = Node(
        id="1",
        type="microservice",
        position={"x": 0, "y": 0},
        data={"label": "MyService", "type": "Microservice"}
    )
    
    db_node = Node(
        id="2",
        type="database",
        position={"x": 0, "y": 0},
        data={
            "label": "CloudDB", 
            "type": "Database",
            "dbMode": "cloud",
            "dbHost": "my-cloud-db.aws.com",
            "dbUser": "admin",
            "dbPassword": "secret_password",
            "dbName": "production_db"
        }
    )
    
    # Create Edge
    edge = Edge(
        id="e1-2",
        source="1",
        target="2"
    )
    
    diagram = Diagram(
        nodes=[service_node, db_node],
        edges=[edge],
        project_name=project_name
    )
    
    # Generate
    print(f"Generating project: {project_name}...")
    generate_project(diagram)
    
    # Verify
    base_path = os.path.join(os.getcwd(), project_name)
    docker_compose_path = os.path.join(base_path, "docker-compose.yml")
    
    with open(docker_compose_path, "r") as f:
        content = f.read()
        
    print("\n--- docker-compose.yml content ---")
    print(content)
    print("----------------------------------\n")
    
    # Checks
    if "CloudDB:" in content:
        print("FAIL: CloudDB service found in docker-compose (should be skipped).")
    else:
        print("PASS: CloudDB service correctly skipped.")
        
    expected_url = "postgresql://admin:secret_password@my-cloud-db.aws.com:5432/production_db"
    if expected_url in content:
        print(f"PASS: DATABASE_URL correctly injected: {expected_url}")
    else:
        print(f"FAIL: DATABASE_URL mismatch.\nExpected: {expected_url}")

    # Cleanup
    # shutil.rmtree(base_path)

if __name__ == "__main__":
    test_cloud_db_generation()
