from fastapi import APIRouter

from app.core.deps import SessionDep
from app.services.pollen_service import sync_allergen_data

router = APIRouter(
    prefix="/pollen_forecast",
    tags=["pollen_forecast"],
    responses={404: {"description": "Not found"}},
)

@router.get("/{location}")
def get_pollen_forecast(location: str, db: SessionDep):
    """
    Call sync pollen data to get pollen data stored in db
    if no data, sync will call external API.
    """
    return sync_allergen_data(location, db)
