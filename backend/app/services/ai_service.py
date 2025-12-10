from app.models import Diagram, Node, Edge
import uuid
import os
import json
from typing import Optional
try:
    from openai import OpenAI
except ImportError:
    OpenAI = None

def generate_diagram_from_prompt(prompt: str, project_type: str) -> Diagram:
    """
    Generates a Diagram based on a natural language prompt.
    Uses OpenAI if OPENAI_API_KEY is set, otherwise falls back to heuristics.
    """
    api_key = os.getenv("OPENAI_API_KEY")
    if api_key and OpenAI:
        try:
            return generate_diagram_with_llm(prompt, project_type, api_key)
        except Exception as e:
            print(f"LLM generation failed, falling back to heuristics: {e}")
            return generate_diagram_heuristic(prompt, project_type)
    else:
        return generate_diagram_heuristic(prompt, project_type)

def generate_diagram_with_llm(prompt: str, project_type: str, api_key: str) -> Diagram:
    client = OpenAI(api_key=api_key)
    
    system_prompt = """
    You are an expert software architect. Create a system architecture diagram based on the user's description.
    You must return a JSON object that matches the following Pydantic schema:
    
    class Node(BaseModel):
        id: str
        type: str # Options: 'Microservice', 'Database', 'Gateway', 'Queue', 'Web App', 'Mobile App'
        data: Dict[str, Any] # Must include 'label' (str) and 'type' (same as above). Optional: 'icon', 'color'
        position: Dict[str, float] # x, y coordinates. Spread them out nicely.
        
    class Edge(BaseModel):
        id: str
        source: str # node id
        target: str # node id
        
    class Diagram(BaseModel):
        nodes: List[Node]
        edges: List[Edge]
        project_name: str
        
    Ensure the nodes are positioned logically (e.g., Client at top, Gateway below, Services below that, Databases at bottom).
    Use specific colors for types:
    - Web/Mobile: bg-blue-500 / bg-purple-600
    - Gateway: bg-orange-500
    - Microservice: bg-green-600
    - Database: bg-red-600
    - Queue: bg-blue-800
    """
    
    user_prompt = f"Project Type: {project_type}\nDescription: {prompt}"
    
    response = client.chat.completions.create(
        model="gpt-4-turbo-preview",
        response_format={"type": "json_object"},
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ]
    )
    
    content = response.choices[0].message.content
    data = json.loads(content)
    
    # Validate and convert to Diagram model
    return Diagram(**data)

def generate_diagram_heuristic(prompt: str, project_type: str) -> Diagram:
    """
    Legacy heuristic generation.
    """
    prompt = prompt.lower()
    nodes = []
    edges = []
    
    # Helper to add node
    def add_node(label, type, x, y, icon=None, color=None):
        node_id = str(uuid.uuid4())
        data = {"label": label, "type": type}
        if icon: data["icon"] = icon
        if color: data["color"] = color
        
        nodes.append(Node(
            id=node_id,
            type=type.lower().replace(" ", ""), # simplified type mapping
            position={"x": x, "y": y},
            data=data
        ))
        return node_id

    # Helper to add edge
    def add_edge(source, target):
        edges.append(Edge(
            id=f"e{source}-{target}",
            source=source,
            target=target
        ))

    # 1. Client Layer
    client_id = None
    if project_type == 'mobile':
        client_id = add_node("Mobile App", "Mobile App", 250, 50, "Mobile", "bg-purple-600")
    else:
        client_id = add_node("Web App", "Web App", 250, 50, "Web", "bg-blue-500")

    # 2. Gateway / Load Balancer
    gateway_id = None
    if "load balancer" in prompt or "scale" in prompt:
        gateway_id = add_node("Load Balancer", "Load Balancer", 250, 200, "Server", "bg-yellow-500")
    else:
        gateway_id = add_node("API Gateway", "API Gateway", 250, 200, "Gateway", "bg-orange-500")
    
    add_edge(client_id, gateway_id)

    # 3. Services (Heuristic Analysis)
    service_ids = []
    
    # Core Service
    core_svc_id = add_node("Core Service", "Microservice", 250, 350, "Microservice", "bg-green-600")
    add_edge(gateway_id, core_svc_id)
    service_ids.append(core_svc_id)

    # Auth Service (almost always needed)
    if "auth" in prompt or "login" in prompt or "user" in prompt:
        auth_id = add_node("Auth Service", "Microservice", 50, 350, "Key", "bg-blue-500")
        add_edge(gateway_id, auth_id)
        service_ids.append(auth_id)

    # Payment Service
    if "payment" in prompt or "stripe" in prompt or "shop" in prompt:
        pay_id = add_node("Payment Service", "Microservice", 450, 350, "Microservice", "bg-green-600")
        add_edge(gateway_id, pay_id)
        service_ids.append(pay_id)

    # Search Service
    if "search" in prompt:
        search_id = add_node("Search Service", "Microservice", 650, 350, "Microservice", "bg-green-600")
        add_edge(gateway_id, search_id)
        service_ids.append(search_id)
        
        # Elasticsearch
        es_id = add_node("Elasticsearch", "ELK", 650, 500, "Stack", "bg-blue-400")
        add_edge(search_id, es_id)

    # 4. Data Layer
    # Main DB
    db_id = add_node("Primary DB", "Database", 250, 500, "Database", "bg-red-600")
    add_edge(core_svc_id, db_id)

    # Redis/Cache
    if "cache" in prompt or "fast" in prompt or "real-time" in prompt:
        redis_id = add_node("Redis Cache", "Database", 450, 500, "Stack", "bg-red-400") # Updated icon/color
        add_edge(core_svc_id, redis_id)

    # Kafka/Queue
    if "queue" in prompt or "async" in prompt or "event" in prompt:
        kafka_id = add_node("Kafka", "RabbitMQ/KAFKA", 50, 500, "Queue", "bg-blue-800")
        add_edge(core_svc_id, kafka_id)

    return Diagram(nodes=nodes, edges=edges, project_name="ai_generated_project")
