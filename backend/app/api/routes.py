from fastapi import APIRouter, HTTPException, Depends
from app.models import Diagram
from app.services.generator import generate_project
from app.data.templates import get_template_by_id
from app.services.ai_service import generate_diagram_from_prompt
from pydantic import BaseModel
from app.core.logger import logger

router = APIRouter()

class PromptRequest(BaseModel):
    prompt: str
    projectType: str

@router.get("/templates/{template_id}", response_model=Diagram)
async def get_template(template_id: str):
    log = logger.bind(template_id=template_id)
    log.info("fetching_template")
    
    template = get_template_by_id(template_id)
    if not template:
        log.warning("template_not_found")
        raise HTTPException(status_code=404, detail="Template not found")
    
    log.info("template_fetched")
    return template

@router.post("/generate")
async def generate_code(diagram: Diagram):
    log = logger.bind(project_name=diagram.project_name)
    log.info("starting_code_generation")
    
    # Global handler will catch any exceptions here
    result = generate_project(diagram)
    log.info("code_generation_success")
    return result

@router.post("/generate-from-prompt", response_model=Diagram)
async def generate_from_prompt(request: PromptRequest):
    log = logger.bind(prompt=request.prompt, project_type=request.projectType)
    log.info("starting_ai_generation")
    
    # Global handler will catch any exceptions here
    diagram = generate_diagram_from_prompt(request.prompt, request.projectType)
    log.info("ai_generation_success", nodes_count=len(diagram.nodes))
    return diagram
