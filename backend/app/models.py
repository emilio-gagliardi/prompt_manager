from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .database import Base


class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)
    prompts = relationship("Prompt", back_populates="project")


class Prompt(Base):
    __tablename__ = "prompts"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"))
    name = Column(String, nullable=False)
    content = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    tags = Column(String, nullable=True)
    notes = Column(String, nullable=True)
    project = relationship("Project", back_populates="prompts")
    feedbacks = relationship("PromptFeedback", back_populates="prompt")


class PromptFeedback(Base):
    __tablename__ = "prompt_feedbacks"

    id = Column(Integer, primary_key=True, index=True)
    prompt_id = Column(Integer, ForeignKey("prompts.id"))
    is_positive = Column(Boolean, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    prompt = relationship("Prompt", back_populates="feedbacks")
