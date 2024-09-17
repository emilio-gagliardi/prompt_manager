from pydantic import BaseModel, Field
from datetime import datetime
from typing import List, Optional


class ProjectBase(BaseModel):
    name: str


class ProjectCreate(ProjectBase):
    pass


class Project(ProjectBase):
    id: int

    class Config:
        from_attributes = True


class PromptBase(BaseModel):
    name: str
    content: str


class PromptCreate(PromptBase):
    project_id: int
    tags: Optional[str] = None
    notes: Optional[str] = None


class Prompt(PromptBase):
    id: int
    project_id: int
    created_at: datetime
    tags: Optional[str] = None
    notes: Optional[str] = None

    class Config:
        from_attributes = True

    @property
    def tags_list(self) -> List[str]:
        return self.tags.split(",") if self.tags else []


class PromptFeedbackBase(BaseModel):
    is_positive: bool


class PromptFeedbackCreate(PromptFeedbackBase):
    prompt_id: int


class PromptFeedback(PromptFeedbackBase):
    id: int
    prompt_id: int
    created_at: datetime

    class Config:
        from_attributes = True


class ProjectIdQuery(BaseModel):
    project_id: int = Field(..., description="The ID of the project")
