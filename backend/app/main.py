# backend/app/main.py
from fastapi import FastAPI, Depends
from contextlib import asynccontextmanager
from sqlalchemy.exc import OperationalError
from .database import SessionLocal, check_database_connection
from .config import get_settings
from .routers import projects, prompts, feedback

settings = get_settings()

app = FastAPI()

@asynccontextmanager
async def lifespan(app: FastAPI):
    db = SessionLocal()

    await check_database_connection(db)
    yield
    db.close()

# Include your routers
app.include_router(projects.router)
app.include_router(prompts.router)
app.include_router(feedback.router)
