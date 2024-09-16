# backend/app/dependencies.py
from fastapi import Depends, HTTPException, status
from .database import SessionLocal
from .main import app

def get_db():
    if not app.state.database_available:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database connection could not be established."
        )
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
