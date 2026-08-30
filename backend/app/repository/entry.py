from datetime import date, datetime, timezone
from sqlmodel import select
from uuid import UUID

from app.schemas.entry import Entry, EntryUpsert
from app.core.deps import SessionDep


def get_entry_by_date(session: SessionDep, entry_date: date, user_id: UUID) -> Entry | None:
    statement = select(Entry).where(Entry.date == entry_date, Entry.user_id == user_id)
    return session.exec(statement).first()


def upsert_entry(session: SessionDep, user_id: UUID, entry_date: date, payload: EntryUpsert) -> Entry:

    db_entry = get_entry_by_date(session, entry_date, user_id)

    if db_entry:
        data = payload.model_dump(exclude={"date"})  # date can never be updated
        db_entry.sqlmodel_update(data, update={"updated_at": datetime.now(timezone.utc)})
    else:
        db_entry = Entry.model_validate(payload, update={"user_id": user_id})

    session.add(db_entry)
    return db_entry