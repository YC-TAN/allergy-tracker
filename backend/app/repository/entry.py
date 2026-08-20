from app.schemas.entry import Entry
from app.deps import SessionDep
from datetime import date
from sqlmodel import select

def get_entry_by_date(session: SessionDep, entry_date: date) -> Entry | None:
    statement = select(Entry).where(Entry.date == entry_date)
    return session.exec(statement).first()