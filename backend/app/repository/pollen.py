from datetime import date
from sqlmodel import select
from sqlalchemy.dialects.postgresql import insert as pg_insert

from app.core.deps import SessionDep
from app.schemas.pollen_forecast import PollenForecast


def get_allergen_data(check_date: date, location: str, db: SessionDep) -> PollenForecast | None:
    """Retrieve allergen forecast data for a specific date and location.

    Args:
        check_date (date): The date to query for allergen data.
        location (str): The location to filter by.
        db (SessionDep): Database session dependency.

    Returns:
        PollenForecast | None: The matching forecast record, if one exists.
    """
    statement = select(PollenForecast).where(
        PollenForecast.date == check_date,
        PollenForecast.location == location,
    )
    return db.exec(statement).first()


def create_allergen_data(allergen_data: dict, db: SessionDep) -> PollenForecast:
    """Insert or ignore extracted allergen forecast data for a date/location pair.

    This operation tries to insert the supplied forecast record. If a record
    already exists for the same date and location, the insert is skipped and the
    existing row is returned instead.

    Args:
        allergen_data (dict): Raw allergen forecast data used to construct a
            PollenForecast record.
        db (SessionDep): Database session dependency.

    Returns:
        PollenForecast: The stored or existing forecast record.
    """

    statement = pg_insert(PollenForecast).values(**allergen_data)
    statement = statement.on_conflict_do_nothing(
        index_elements=["date", "location"]
    ).returning(PollenForecast)

    result = db.exec(statement).one_or_none()
    db.commit()

    if result is None:
        result = get_allergen_data(
            allergen_data["date"],
            allergen_data["location"],
            db
        )

    return result