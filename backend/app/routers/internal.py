"""
    This module includes endpoints that are only called internally.
    Users cannot access these endpoints.
"""

from fastapi import APIRouter, HTTPException
from sqlmodel import text

from app.core.deps import SessionDep
from app.services.pollen_service import sync_allergen_data

router = APIRouter()


@router.get("/health/db")
def db_health(session: SessionDep):
    """
        This is a cron-triggered endpoint.
        It automatically check db health at a set time.
    """
    try:
        session.exec(text("SELECT 1"))
        return {"status": "ok"}
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"Postgres unreachable: {e}")


@router.post("/pollen_forecast/{location}")
async def fetch_and_save_pollen_forecast(location: str, session: SessionDep):
    """
        This is a cron-triggered endpoint.
        It automatically fetch data daily.
    """
    return await sync_allergen_data(location, session)
