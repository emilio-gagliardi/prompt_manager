from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app import crud, schemas
from app.database import get_db
import logging
from typing import List

router = APIRouter()
logger = logging.getLogger(__name__)


@router.post("/prompts/", response_model=schemas.Prompt)
def create_prompt(prompt: schemas.PromptCreate, db: Session = Depends(get_db)):
    return crud.create_prompt(db=db, prompt=prompt)


@router.get("/prompts/{prompt_id}", response_model=schemas.Prompt)
async def read_prompt(prompt_id: int, db: Session = Depends(get_db)):
    # logger.info(f"Fetching prompt with id: {prompt_id}")
    try:
        db_prompt = crud.get_prompt(db, prompt_id=prompt_id)
        if db_prompt is None:
            logger.warning(f"Prompt with id {prompt_id} not found")
            raise HTTPException(status_code=404, detail="Prompt not found")
        # logger.info(f"Successfully fetched prompt: {db_prompt}")
        return db_prompt
    except Exception as e:
        logger.error(f"Error fetching prompt: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.put("/prompts/{prompt_id}", response_model=schemas.Prompt)
def update_prompt(
    prompt_id: int, prompt: schemas.PromptCreate, db: Session = Depends(get_db)
):
    db_prompt = crud.update_prompt(db, prompt_id=prompt_id, prompt=prompt)
    if db_prompt is None:
        raise HTTPException(status_code=404, detail="Prompt not found")
    return db_prompt


@router.delete("/prompts/{prompt_id}", response_model=bool)
def delete_prompt(prompt_id: int, db: Session = Depends(get_db)):
    success = crud.delete_prompt(db, prompt_id=prompt_id)
    if not success:
        raise HTTPException(status_code=404, detail="Prompt not found")
    return success


@router.get("/prompts", response_model=List[int])
async def get_prompt_ids_for_project(
    project_id: int = Query(...), db: Session = Depends(get_db)
):
    logger.info(f"Fetching prompt IDs for project: {project_id}")
    try:
        prompts = crud.get_prompts_by_project(db, project_id=project_id)
        prompt_ids = [prompt.id for prompt in prompts]
        logger.info(f"Found prompt IDs for project: {prompt_ids}")
        return prompt_ids
    except Exception as e:
        logger.error(f"Error fetching prompt IDs: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")
