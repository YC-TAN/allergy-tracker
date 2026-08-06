import pytest
import os
import subprocess
from pathlib import Path

from sqlmodel import create_engine, Session, text
from fastapi.testclient import TestClient

from app.main import app
from app.db import get_session


PROJECT_ROOT = Path(__file__).resolve().parents[3]
TEST_DB_URL = os.environ["TEST_DB_URL"]

@pytest.fixture(scope="session", autouse=True)
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
def engine():
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

    yield session

    session.close()
    transaction.rollback()
    connection.close()


@pytest.fixture
def client(session):
    """TestClient with the rollback-wrapped session."""

    def _get_test_session():
        yield session

    app.dependency_overrides[get_session] = _get_test_session

    with TestClient(app) as c:
        yield c

    app.dependency_overrides.clear()
