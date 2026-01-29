import sys
import os
import json

# Add backend to path
sys.path.append(os.path.join(os.getcwd(), 'backend'))

from app.services.ai_service import generate_diagram_from_prompt

def test_ai_generation():
    prompt = "A food delivery app with real-time tracking, payments, and search."
    print(f"Testing Prompt: '{prompt}'")
    
    diagram = generate_diagram_from_prompt(prompt, "mobile")
    
    print(f"Generated {len(diagram.nodes)} nodes and {len(diagram.edges)} edges.")
    
    node_types = [n.data['type'] for n in diagram.nodes]
    print("Node Types:", node_types)
    
    # Assertions
    required_types = ["Mobile App", "API Gateway", "Microservice", "Database"]
    for rt in required_types:
        if rt in node_types:
            print(f"PASS: Found {rt}")
        else:
            print(f"FAIL: Missing {rt}")
            
    # Check specific heuristics
    if "Payment Service" in [n.data['label'] for n in diagram.nodes]:
        print("PASS: Found Payment Service (from 'payments' keyword)")
    else:
        print("FAIL: Missing Payment Service")

    if "Redis Cache" in [n.data['label'] for n in diagram.nodes]:
        print("PASS: Found Redis Cache (from 'real-time' keyword)")
    else:
        print("FAIL: Missing Redis Cache")

if __name__ == "__main__":
    test_ai_generation()
