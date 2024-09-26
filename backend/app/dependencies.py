# backend/app/dependencies.py
from fastapi import Depends, HTTPException, status
from app.database import SessionLocal


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def check_database_available(db=Depends(get_db)):
    if not db:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database connection could not be established.",
        )
    return db
