import os
import shutil
from app.models import Diagram

def generate_project(diagram: Diagram):
    project_name = diagram.project_name or "generated_project"
    base_path = os.path.join(os.getcwd(), project_name)
    
    if os.path.exists(base_path):
        shutil.rmtree(base_path)
    os.makedirs(base_path)

    docker_compose_services = {}
    nginx_upstreams = []
    nginx_locations = []

    # First pass: Identify nodes and build basic service map
    nodes_map = {node.id: node for node in diagram.nodes}
    
    # Helper to find connected databases for a service
    def get_connected_dbs(service_node_id):
        dbs = []
        for edge in diagram.edges:
            if edge.source == service_node_id:
                target_node = nodes_map.get(edge.target)
                if target_node and target_node.data.get('type') == 'Database':
                    dbs.append(target_node)
            elif edge.target == service_node_id:
                source_node = nodes_map.get(edge.source)
                if source_node and source_node.data.get('type') == 'Database':
                    dbs.append(source_node)
        return dbs

    for node in diagram.nodes:
        label = node.data.get('label', 'unknown').lower().replace(" ", "_").replace(".", "")
        node_type = node.data.get('type', 'unknown')
        component_path = os.path.join(base_path, label)
        
        if node_type == "Mobile App":
            generate_mobile_app(component_path, label)
            # Mobile apps usually don't go into docker-compose for backend orchestration, 
            # but we can add them if we want to serve web-builds.
        
        elif node_type == "Web App":
            generate_web_app(component_path, label)
            docker_compose_services[label] = {
                'build': f'./{label}',
                'ports': ['3000:3000']
            }

        elif node_type == "Microservice" or node_type == "Service":
            connected_dbs = get_connected_dbs(node.id)
            env_vars = {}
            for db in connected_dbs:
                db_label = db.data.get('label', 'db').lower().replace(" ", "_")
                env_vars['DATABASE_URL'] = f"postgresql://user:password@{db_label}:5432/db"
            
            generate_microservice(component_path, label, env_vars)
            
            service_config = {
                'build': f'./{label}',
                'environment': [f"{k}={v}" for k, v in env_vars.items()]
            }
            docker_compose_services[label] = service_config
            
            # Add to Nginx config
            nginx_upstreams.append(f"upstream {label}_upstream {{ server {label}:8000; }}")
            nginx_locations.append(f"    location /{label}/ {{\n        proxy_pass http://{label}_upstream/;\n    }}")

        elif node_type == "Database":
            docker_compose_services[label] = {
                'image': 'postgres:13',
                'environment': [
                    'POSTGRES_USER=user',
                    'POSTGRES_PASSWORD=password',
                    'POSTGRES_DB=db'
                ],
                'volumes': [f'{label}_data:/var/lib/postgresql/data']
            }

        elif node_type == "API Gateway" or "gateway" in label:
            # We'll generate the gateway config at the end
            pass

    # Generate API Gateway if needed (or if we have microservices)
    if nginx_upstreams:
        gateway_path = os.path.join(base_path, "api_gateway")
        os.makedirs(gateway_path, exist_ok=True)
        
        nginx_conf = "events {}\nhttp {\n" + "\n".join(nginx_upstreams) + "\n    server {\n        listen 80;\n" + "\n".join(nginx_locations) + "\n    }\n}"
        
        with open(os.path.join(gateway_path, "nginx.conf"), "w") as f:
            f.write(nginx_conf)
            
        with open(os.path.join(gateway_path, "Dockerfile"), "w") as f:
            f.write("FROM nginx:alpine\nCOPY nginx.conf /etc/nginx/nginx.conf")
            
        docker_compose_services['api_gateway'] = {
            'build': './api_gateway',
            'ports': ['80:80'],
            'depends_on': [s for s in docker_compose_services.keys() if s != 'api_gateway']
        }

    # Generate docker-compose.yml
    generate_docker_compose(base_path, docker_compose_services)

    return {"message": "Code generated successfully", "path": base_path}

def generate_mobile_app(path, label):
    os.makedirs(path, exist_ok=True)
    # ... (Keep existing mobile generation logic or simplify)
    with open(os.path.join(path, "App.js"), "w") as f:
        f.write(f"// Mobile App: {label}\nimport React from 'react';\nimport {{ Text, View }} from 'react-native';\nexport default function App() {{ return <View><Text>Welcome to {label}</Text></View>; }}")
    with open(os.path.join(path, "package.json"), "w") as f:
        f.write(f'{{"name": "{label}", "version": "1.0.0", "dependencies": {{"react": "18.2.0", "react-native": "0.71.8"}} }}')

def generate_web_app(path, label):
    os.makedirs(path, exist_ok=True)
    # ... (Keep existing web generation logic or simplify)
    os.makedirs(os.path.join(path, "src"), exist_ok=True)
    with open(os.path.join(path, "src", "App.jsx"), "w") as f:
        f.write(f"// Web App: {label}\nexport default function App() {{ return <h1>Welcome to {label}</h1>; }}")
    with open(os.path.join(path, "package.json"), "w") as f:
        f.write(f'{{"name": "{label}", "version": "0.0.0", "scripts": {{"dev": "vite", "build": "vite build"}}, "dependencies": {{"react": "^18.2.0"}} }}')
    with open(os.path.join(path, "Dockerfile"), "w") as f:
        f.write("FROM node:18-alpine\nWORKDIR /app\nCOPY . .\nRUN npm install\nCMD [\"npm\", \"run\", \"dev\"]")

def generate_microservice(path, label, env_vars):
    os.makedirs(path, exist_ok=True)
    os.makedirs(os.path.join(path, "app"), exist_ok=True)
    
    # main.py
    with open(os.path.join(path, "app", "main.py"), "w") as f:
        f.write(f"""
from fastapi import FastAPI
import os

app = FastAPI(title="{label}")

@app.get("/")
def read_root():
    return {{"message": "Hello from {label}!"}}

@app.get("/health")
def health_check():
    return {{"status": "healthy", "db_url": os.getenv("DATABASE_URL", "Not Configured")}}
""")

    # requirements.txt
    with open(os.path.join(path, "requirements.txt"), "w") as f:
        f.write("fastapi\nuvicorn\nsqlalchemy\npsycopg2-binary\n")

    # Dockerfile
    with open(os.path.join(path, "Dockerfile"), "w") as f:
        f.write("""
FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
""")

def generate_docker_compose(base_path, services):
    content = "version: '3.8'\nservices:\n"
    volumes = []
    
    for name, config in services.items():
        content += f"  {name}:\n"
        for key, value in config.items():
            if key == 'environment':
                content += "    environment:\n"
                for env in value:
                    content += f"      - {env}\n"
            elif key == 'ports':
                content += "    ports:\n"
                for port in value:
                    content += f"      - '{port}'\n"
            elif key == 'depends_on':
                content += "    depends_on:\n"
                for dep in value:
                    content += f"      - {dep}\n"
            elif key == 'volumes':
                content += "    volumes:\n"
                for vol in value:
                    content += f"      - {vol}\n"
                    vol_name = vol.split(':')[0]
                    if vol_name not in volumes:
                        volumes.append(vol_name)
            else:
                content += f"    {key}: {value}\n"
    
    if volumes:
        content += "\nvolumes:\n"
        for vol in volumes:
            content += f"  {vol}:\n"

    with open(os.path.join(base_path, "docker-compose.yml"), "w") as f:
        f.write(content)
