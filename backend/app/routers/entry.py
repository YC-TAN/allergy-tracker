from datetime import date
from fastapi import APIRouter, Query, status

from app.core.deps import SessionDep, CurrentUserDep
from app.schemas.entry import Entry, EntryUpsert, EntryResponse, MigrateRequest, MigrateResponse
from app.repository import entry as entry_repo
from app.services import entry_service
from app.errors.app_error import EntryNotFoundError
from app.utils.date_utils import NotFutureDate

router = APIRouter(
    prefix="/entries", 
    tags=["entries"]
)


@router.get("/{entry_date}", response_model=EntryResponse)
def read_entry(
    entry_date: date, 
    session: SessionDep,
    user_id: CurrentUserDep
):
    """
    Get daily entry record using date.
    """
    entry = entry_repo.get_entry_by_date(
        session,
        entry_date,
        user_id
    )

    if entry is None:
        raise EntryNotFoundError()

    return entry


@router.put("/{entry_date}", response_model=EntryResponse)
def upsert_entry(entry_date: NotFutureDate, payload: EntryUpsert, session: SessionDep, user_id: CurrentUserDep,):
    db_entry = entry_repo.upsert_entry(
        session, 
        user_id, 
        entry_date, 
        payload
    )
    
    session.commit()
    session.refresh(db_entry)
    return db_entry


@router.post("/migrate", response_model=MigrateResponse)
def migrate_entries(body: MigrateRequest, session: SessionDep, user_id: CurrentUserDep):
    synced, failed = [], []
    for entry in body.entries:
        try:
            # Create a savepoint per entry so a failure only unwind that entry
            with session.begin_nested():
                db_entry = entry_repo.upsert_entry(session, user_id, entry.date, entry)
                synced.append(db_entry.model_dump()) # convert back to response
        except Exception:
            # Rolls back only to the begin_nested() savepoint, preserving previous loop items
            failed.append(str(entry.date))
    session.commit()                 # commit everything that succeeded, in one transaction

    return {"synced": synced, "failed": failed}


@router.get("/", response_model=list[EntryResponse])
def get_entries(
    session: SessionDep,
    user_id: CurrentUserDep,
    # start_date: NotFutureDate,
    days: int = Query(default=7, ge=1, le=120),
):
    return entry_service.get_entries_range(session, user_id, days)

# @router.put("/{entry_date}", response_model=EntryResponse)
# def update_entry(entry_date: date, payload: EntryUpdate, session: SessionDep, user_id: CurrentUserDep,):
#     db_entry = entry_repo.get_entry_by_date(
#             session,
#             entry_date,
#             user_id
#         )
#     if db_entry is None:
#         raise HTTPException(status_code=404, detail="No entry for this date")

#     entry = payload.model_dump()
#     db_entry.sqlmodel_update(
#         entry,
#         update={"updated_at": datetime.now(timezone.utc)}
#     )
#     session.add(db_entry)
#     session.commit()
#     session.refresh(db_entry)
#     return db_entry

@router.post("", response_model=EntryResponse, status_code=status.HTTP_201_CREATED)
def create_entry(
    payload: EntryUpsert, 
    session: SessionDep,
    user_id: CurrentUserDep,
):
    """
    Convert payload into db object then save into database and return the db object
    """
    db_item = Entry.model_validate(payload, update={"user_id": user_id})
    session.add(db_item)
    session.commit()
    session.refresh(db_item)
    return db_item