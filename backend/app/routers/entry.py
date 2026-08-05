from uuid import UUID
from fastapi import APIRouter, HTTPException, status

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


@router.get("/{entry_id}", response_model=Entry)
def read_item(entry_id: UUID, session: SessionDep):
    entry = session.get(Entry, entry_id)
    if not entry:
        raise HTTPException(status_code=404, detail="Item not found")
    return entry