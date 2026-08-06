from datetime import date
from uuid import UUID
from fastapi import APIRouter, HTTPException, status
from sqlmodel import select

from app.deps import SessionDep
from app.schemas.entry import Entry, EntryCreate

router = APIRouter(
    prefix="/entries", 
    tags=["entries"]
)

@router.post("/", response_model=Entry, status_code=status.HTTP_201_CREATED)
def create_entry(payload: EntryCreate, session: SessionDep):
    """
    Convert payload into db object then save into database and return the db object
    """
    db_item = Entry.model_validate(payload)
    session.add(db_item)
    session.commit()
    session.refresh(db_item)
    return db_item


@router.get("/{entry_date}", response_model=Entry)
def read_item(entry_date: date, session: SessionDep):
    """
    Get daily entry record using date.
    """
    statement = select(Entry).where(Entry.date == entry_date)
    entry = session.exec(statement).first()

    if entry is None:
        raise HTTPException(status_code=404, detail="No entry for this date")

    return entry