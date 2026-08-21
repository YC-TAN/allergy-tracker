import pytest
import os
import subprocess
from pathlib import Path
from uuid import uuid4
from sqlmodel import create_engine, Session
from sqlalchemy import text
from fastapi.testclient import TestClient

from app.main import app
from app.db import get_session
from app.core.auth import get_current_user_id


PROJECT_ROOT = Path(__file__).resolve().parents[3]
TEST_DB_URL = os.environ["TEST_DB_URL"]
TEST_USER_ID = uuid4()

@pytest.fixture(
    scope="session", 
    # autouse=True
    )
def _reset_test_db():
    """
    Runs once per test session. 
    Replays all migrations against a clean DB.
    """
    subprocess.run(
        ["npx", "supabase", "db", "reset"], 
        check=True, 
        cwd=PROJECT_ROOT
    )
    yield


@pytest.fixture(scope="session")
def engine(_reset_test_db):
    """
    Depends on `_reset_test_db`.
    The DB is reset and migrated exactly once per test session, 
    and only when a test actually needs a DB connection (via `session`/`client`)
    """
    return create_engine(TEST_DB_URL)


@pytest.fixture
def session(engine):
    """
    Per-test isolation: open a connection, start an outer transaction, bind the
    SQLModel Session to it, and roll everything back after the test — including
    anything the test code itself committed. Nothing a test does ever persists.
    """
    connection = engine.connect()
    transaction = connection.begin()
    session = Session(bind=connection, join_transaction_mode="create_savepoint")

    # Seed the FK-referenced user row so entries.user_id can point at it
    session.exec(
        text("""
            INSERT INTO auth.users (id, email, encrypted_password, aud, role)
            VALUES (:id, :email, '', 'authenticated', 'authenticated')
        """),
        params={"id": TEST_USER_ID, "email": f"{TEST_USER_ID}@test.local"},
    )
    session.commit()  # commits into the savepoint, still rolled back at teardown

    yield session

    session.close()
    transaction.rollback()
    connection.close()


@pytest.fixture
def client(session):
    """TestClient with the rollback-wrapped session."""

    def _get_test_session():
        yield session

    def _get_current_user_id():
        return TEST_USER_ID

    app.dependency_overrides[get_session] = _get_test_session
    app.dependency_overrides[get_current_user_id] = _get_current_user_id

    with TestClient(app) as c:
        yield c

    app.dependency_overrides.clear()
