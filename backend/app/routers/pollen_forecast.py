from fastapi import APIRouter
from app.deps import SessionDep
from app.services.pollen_service import sync_allergen_data

router = APIRouter(
    prefix="/pollen_forecast",
    tags=["pollen_forecast"],
    responses={404: {"description": "Not found"}},
)

@router.get("/{location}")
def get_pollen_forecast(location: str, db: SessionDep):
    """
    call sync pollen data to get pollen data stored in db
    if no data, sync will call 
    """
    return sync_allergen_data(location, db)
