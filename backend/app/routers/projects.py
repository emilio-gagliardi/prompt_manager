# backend/app/routers/projects.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app import crud
from app import schemas
from app.dependencies import get_db

router = APIRouter()


@router.get("/projects/", response_model=List[schemas.Project])
def read_projects(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    projects = crud.get_projects(db, skip=skip, limit=limit)
    return projects


@router.get("/projects/with-prompts", response_model=List[schemas.ProjectWithPrompts])
def read_projects_with_prompts(
    skip: int = 0, limit: int = 100, db: Session = Depends(get_db)
):
    projects = crud.get_projects(db, skip=skip, limit=limit)
    result = []
    for project in projects:
        project_with_prompts = crud.get_project_with_prompts(db, project.id)
        result.append(project_with_prompts)
    return result


# ... other endpoints ...
