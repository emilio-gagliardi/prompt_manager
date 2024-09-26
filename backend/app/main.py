"""
FastAPI main application file.

This file initializes the FastAPI application, sets up the database connection,
and includes the necessary routers.

To run the FastAPI application:
1. Navigate to the 'backend' directory:
   cd backend

2. Execute the following command in the terminal:
   uvicorn app.main:app --host 0.0.0.0 --port 7070 --reload

   This command does the following:
   - uvicorn: The ASGI server used to run the FastAPI application
   - app.main:app: Points to the `app` object in this file
   - --host 0.0.0.0: Makes the server accessible from any IP address
   - --port 7070: Runs the server on port 7070
   - --reload: Enables auto-reloading when code changes are detected (useful for development)

The application will start and be accessible at http://localhost:7070.

Note: The `Depends` import is currently unused and can be removed if not needed in future implementations.
"""

from app.config import get_settings
import logging
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from sqlalchemy.exc import OperationalError
from app.database import SessionLocal, check_database_connection

from app.routers import projects, prompts

# , prompts

settings = get_settings()
settings.add_root_to_sys_path()
print(f"{settings.root_directory}")

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    db = SessionLocal()
    try:
        await check_database_connection(db)
        app.state.database_available = True
    except OperationalError:
        app.state.database_available = False
    yield
    db.close()


app = FastAPI(lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Include your routers
app.include_router(projects.router)
app.include_router(prompts.router)


# app.include_router(feedback.router)
@app.get("/hello")
async def read_hello() -> str:
    return "hello world"


if __name__ == "__main__":
    import uvicorn

    print("Starting FastAPI application")
    uvicorn.run(app, host="0.0.0.0", port=7070, reload=True)
