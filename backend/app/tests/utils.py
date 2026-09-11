from datetime import date
from typing import get_args
from sqlmodel import Session
from uuid import UUID, uuid4
from sqlalchemy import text

from app.schemas.locations_literal import Valid_locations
from app.schemas.entry import Entry
# from app.tests.conftest import FIXED_TODAY, TEST_USER_ID

TEST_USER_ID = uuid4()
FIXED_TODAY = date(2026, 8, 1)
test_location = get_args(Valid_locations)[0]  # "Alexandra"

valid_payload = {
    "date": FIXED_TODAY.isoformat(),
    "severity": 1,
    "symptoms": ["nose"],
    "notes": "Contact with pets",
    "location": test_location,
    "honey": True,
}


def create_existing_entry(session: Session, entry_date=None):
    payload = {**valid_payload, "date": entry_date or valid_payload["date"]}
    entry = Entry(**payload, user_id=TEST_USER_ID)  # write to db table directly
    session.add(entry)
    session.commit()
    session.refresh(entry)
    return entry


def create_test_user(session: Session, user_id: UUID) -> None:
    """Insert a minimal auth.users row so entries.user_id's FK resolves."""
    session.exec(
        text("""
            INSERT INTO auth.users (id, email, encrypted_password, aud, role)
            VALUES (:id, :email, '', 'authenticated', 'authenticated')
        """),
        params={"id": user_id, "email": f"{user_id}@test.local"},
    )

    # commits into the savepoint, rolled back at teardown
    session.commit()