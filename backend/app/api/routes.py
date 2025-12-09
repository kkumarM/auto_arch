from fastapi import APIRouter, HTTPException
from app.models import Diagram
from app.data.templates import TEMPLATES
from app.services.generator import generate_project

router = APIRouter()

@router.get("/templates/{template_id}")
async def get_template(template_id: str):
    if template_id not in TEMPLATES:
        raise HTTPException(status_code=404, detail="Template not found")
    return TEMPLATES[template_id]

@router.post("/generate")
async def generate_code(diagram: Diagram):
    try:
        return generate_project(diagram)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
