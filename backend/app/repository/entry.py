from datetime import date, datetime, timezone
from sqlmodel import select
from sqlalchemy.dialects.postgresql import insert as pg_insert
from uuid import UUID

from app.schemas.entry import Entry, EntryUpsert
from app.core.deps import SessionDep


def get_entry_by_date(
    session: SessionDep, entry_date: date, user_id: UUID
) -> Entry | None:
    """Retrieve a single diary entry for a user on a specific date.

    Args:
        session (SessionDep): Database session dependency.
        entry_date (date): The date of the entry to look up.
        user_id (UUID): The user whose entry should be returned.

    Returns:
        Entry | None: The matching entry record, if one exists.
    """
    stmt = select(Entry).where(Entry.date == entry_date, Entry.user_id == user_id)
    return session.exec(stmt).one_or_none()


def upsert_entry(
    session: SessionDep, user_id: UUID, entry_date: date, payload: EntryUpsert
) -> Entry:
    """Insert a new entry or update the existing entry for the given date.

    The repository uses an upsert-style PostgreSQL conflict statement keyed by
    the ``date`` and ``user_id`` pair so the saved payload always reflects the
    latest submission timestamp.

    Args:
        session (SessionDep): Database session dependency.
        user_id (UUID): The authenticated user requesting the write.
        entry_date (date): The date the entry belongs to.
        payload (EntryUpsert): The incoming validated entry payload.

    Returns:
        Entry: The stored or updated entry row returned from the database.
    """
    entry = Entry.model_validate(payload, update={"user_id": user_id, "date": entry_date})
    # pg_insert requires dict not SQLModel instance, 
    # use model_dump() to convert the instance to dict format
    stmt = pg_insert(Entry).values(**entry.model_dump(exclude_unset=False))

    stmt = stmt.on_conflict_do_update(
        index_elements=["date", "user_id"],
        set_={
            "severity": stmt.excluded.severity,
            "symptoms": stmt.excluded.symptoms,
            "notes": stmt.excluded.notes,
            "location": stmt.excluded.location,
            "updated_at": datetime.now(timezone.utc)
        }).returning(Entry)

    # session.refresh() is not needed here as it is for plain ORM pattern to handle SQLModel object expiry
    # returning() already do the same job returning the final row as part of the statement
    # scalar_one will strip the outer Row tuple wrapper returned by exec
    return session.exec(stmt).scalar_one() 

    # db_entry = get_entry_by_date(session, entry_date, user_id)

    # if db_entry:
    #     data = payload.model_dump(exclude={"date"})  # date can never be updated
    #     db_entry.sqlmodel_update(data, update={"updated_at": datetime.now(timezone.utc)})
    # else:
    #     db_entry = Entry.model_validate(payload, update={"user_id": user_id})

    # session.add(db_entry)
    # return db_entry
