from fastapi import APIRouter, HTTPException
from sqlmodel import text

from app.deps import SessionDep

router = APIRouter()

@router.get("/health/db")
def db_health(db: SessionDep):
    try:
        db.exec(text("SELECT 1"))
        return {"status": "ok"}
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"Postgres unreachable: {e}")