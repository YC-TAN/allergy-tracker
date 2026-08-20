from datetime import date, datetime, timezone
from fastapi import APIRouter, HTTPException, status
from sqlmodel import select

from app.deps import SessionDep
from app.schemas.entry import Entry, EntryCreate, EntryUpdate, EntryResponse
from app.repository import entry as entry_repo

router = APIRouter(
    prefix="/entries", 
    tags=["entries"]
)

@router.post("", response_model=EntryResponse, status_code=status.HTTP_201_CREATED)
def create_entry(payload: EntryCreate, session: SessionDep):
    """
    Convert payload into db object then save into database and return the db object
    """
    db_item = Entry.model_validate(payload)
    session.add(db_item)
    session.commit()
    session.refresh(db_item)
    return db_item


@router.get("/{entry_date}", response_model=EntryResponse)
def read_entry(entry_date: date, session: SessionDep):
    """
    Get daily entry record using date.
    """
    entry = entry_repo.get_entry_by_date(
        session,
        entry_date
    )

    if entry is None:
        raise HTTPException(status_code=404, detail="No entry for this date")

    return entry

@router.put("/{entry_date}", response_model=EntryResponse)
def update_entry(entry_date: date, payload: EntryUpdate, session: SessionDep):
    statement = select(Entry).where(Entry.date == entry_date)
    db_entry = session.exec(statement).first()
    if db_entry is None:
        raise HTTPException(status_code=404, detail="No entry for this date")

    entry = payload.model_dump()
    db_entry.sqlmodel_update(
        entry,
        update={"updated_at": datetime.now(timezone.utc)}
    )
    session.add(db_entry)
    session.commit()
    session.refresh(db_entry)
    return db_entry