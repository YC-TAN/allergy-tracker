from fastapi import APIRouter, HTTPException
from sqlmodel import text

from app.deps import SessionDep
from app.services.pollen_service import sync_allergen_data

router = APIRouter()


@router.get("/health/db")
def db_health(db: SessionDep):
    try:
        db.exec(text("SELECT 1"))
        return {"status": "ok"}
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"Postgres unreachable: {e}")


@router.post("/pollen_forecast/{location}")
def fetch_and_save_pollen_forecast(location: str, db: SessionDep):
    """
    This endpoint will be cron-triggered, automatically fetch data daily
    """
    return sync_allergen_data(location, db)
