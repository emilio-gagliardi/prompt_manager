# CRUD operations for projects, prompts, and feedback

from sqlalchemy.orm import Session
from . import models, schemas


def get_prompt(db: Session, prompt_id: int):
    return db.query(models.Prompt).filter(models.Prompt.id == prompt_id).first()


def get_prompts(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Prompt).offset(skip).limit(limit).all()


def create_prompt(db: Session, prompt: schemas.PromptCreate):
    db_prompt = models.Prompt(**prompt.model_dump())
    db.add(db_prompt)
    db.commit()
    db.refresh(db_prompt)
    return db_prompt


def update_prompt(db: Session, prompt_id: int, prompt: schemas.PromptCreate):
    db_prompt = db.query(models.Prompt).filter(models.Prompt.id == prompt_id).first()
    if db_prompt:
        for key, value in prompt.model_dump().items():
            setattr(db_prompt, key, value)
        db.commit()
        db.refresh(db_prompt)
    return db_prompt


def delete_prompt(db: Session, prompt_id: int):
    db_prompt = db.query(models.Prompt).filter(models.Prompt.id == prompt_id).first()
    if db_prompt:
        db.delete(db_prompt)
        db.commit()
        return True
    return False


def get_prompts_by_project(db: Session, project_id: int):
    return db.query(models.Prompt).filter(models.Prompt.project_id == project_id).all()
