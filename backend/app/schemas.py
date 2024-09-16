from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional

class ProjectBase(BaseModel):
    name: str

class ProjectCreate(ProjectBase):
    pass

class Project(ProjectBase):
    id: int
    
    class Config:
        orm_mode = True

class PromptBase(BaseModel):
    name: str
    content: str

class PromptCreate(PromptBase):
    project_id: int

class Prompt(PromptBase):
    id: int
    project_id: int
    created_at: datetime

    class Config:
        orm_mode = True

class PromptFeedbackBase(BaseModel):
    is_positive: bool

class PromptFeedbackCreate(PromptFeedbackBase):
    prompt_id: int

class PromptFeedback(PromptFeedbackBase):
    id: int
    prompt_id: int
    created_at: datetime

    class Config:
        orm_mode = True