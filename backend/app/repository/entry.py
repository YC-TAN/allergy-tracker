from app.schemas.entry import Entry
from app.deps import SessionDep
from datetime import date
from sqlmodel import select
from uuid import UUID

def get_entry_by_date(session: SessionDep, entry_date: date, user_id: UUID) -> Entry | None:
    statement = select(Entry).where(Entry.date == entry_date, Entry.user_id == user_id)
    return session.exec(statement).first()