# backend/app/main.py
from fastapi import FastAPI
from sqlalchemy.exc import OperationalError
from .database import SessionLocal
from .config import get_settings
from .routers import projects, prompts, feedback

settings = get_settings()

app = FastAPI()

@app.on_event("startup")
async def startup_event():
    # Check database connection
    try:
        db = SessionLocal()
        db.execute('SELECT 1')
    except OperationalError:
        app.state.database_available = False
    else:
        app.state.database_available = True
    finally:
        db.close()

# Include your routers
app.include_router(projects.router)
app.include_router(prompts.router)
app.include_router(feedback.router)
