"""Service helpers for entry-related retrieval workflows."""

from datetime import timedelta
from uuid import UUID

from app.schemas.entry import Entry
from app.core.deps import SessionDep
from app.utils.date_utils import get_today_NZT
from app.repository import entry as entry_repo


def get_entries_range(session: SessionDep, user_id: UUID, days: int) -> list[Entry]:
    """Fetch entries from today in NZT back over a day range.

    Args:
        session (SessionDep): The database session dependency.
        user_id (UUID): The authenticated user requesting the read.
        days (int): The number of days of history to include.

    Returns:
        list[Entry]: A list of entry records from today to the requested date range.
    """
    end_date = get_today_NZT()
    start_date = end_date - timedelta(days=days - 1)
    return entry_repo.get_entries_range(session, user_id, start_date, end_date)
