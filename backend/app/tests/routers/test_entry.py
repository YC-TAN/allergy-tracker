import pytest
from datetime import date, timedelta
from fastapi.testclient import TestClient
from sqlmodel import Session
from uuid import uuid4

from app.schemas.entry import Entry
from app.utils.date_utils import get_today_NZT
from app.tests.utils import (TEST_USER_ID, FIXED_TODAY, test_location, valid_payload, create_existing_entry, create_test_user)


# valid_payload = {
#     "date": "2026-08-01", 
#     "severity": 1, 
#     "symptoms": ["nose"], 
#     "notes": "Contact with pets", 
#     "location": test_location,
#     "honey": True
# }

# def create_existing_entry(session: Session):
#     entry = Entry(**valid_payload, user_id=TEST_USER_ID)    # write to db table directly
#     session.add(entry)
#     session.commit()
#     session.refresh(entry)
#     return entry

# GET: Happy path
def test_get_entry_by_date_success(client, session):
    create_existing_entry(session)

    res = client.get(f"/api/entries/{FIXED_TODAY.isoformat()}")
    result = res.json()

    assert res.status_code == 200
    assert result["date"] == valid_payload["date"]
    assert result["severity"] == valid_payload["severity"]
    assert result["symptoms"] == valid_payload["symptoms"]
    assert result["notes"] == valid_payload["notes"]
    assert result["location"] == valid_payload["location"]
    assert result["honey"] == valid_payload["honey"]


# GET: Negative case
@pytest.mark.parametrize(
    "invalid_date, expected_status", 
    [
        pytest.param((date.today() + timedelta(days=2)).isoformat(), 404, id="valid_format_no_entry"),
        pytest.param("invalid-date", 422, id="malformed_string"),
        pytest.param("9999-99-99", 422, id="invalid_month_day"),
    ]
)
def test_get_entry_invalid_or_not_exist_returns_404_or_422(client, invalid_date, expected_status):
    res = client.get(f"/api/entries/{invalid_date}")
    assert res.status_code == expected_status


# POST: Happy
def test_create_entry_success(client, session):
    post_res = client.post("/api/entries", json=valid_payload)
    assert post_res.status_code == 201

    post_result = post_res.json()
    assert "id" in post_result 
    assert "created_at" in post_result 
    assert "updated_at" in post_result 
    assert post_result["date"] == valid_payload["date"]
    assert post_result["severity"] == valid_payload["severity"]
    assert post_result["symptoms"] == valid_payload["symptoms"]
    assert post_result["notes"] == valid_payload["notes"]
    assert post_result["honey"] == valid_payload["honey"]
    assert post_result["location"] == valid_payload["location"]

    get_res = client.get("/api/entries/2026-08-01")
    assert get_res.status_code == 200
    assert get_res.json() == post_result 

    db_entry = session.get(Entry, post_result['id'])
    assert db_entry.user_id == TEST_USER_ID


# POST: default notes and symptoms
def test_create_entry_defaults_symptoms_and_notes_and_honey(client):
    payload = {"date": "2026-08-03", "severity": 0, "location": test_location}   # no symptoms, no notes, no honey
    res = client.post("/api/entries", json=payload)
    result = res.json()

    assert res.status_code == 201
    assert result["symptoms"] == []
    assert result["notes"] == ""
    assert not result["honey"]


# POST: Negative cases (wrong date format, future date, no severity, severity not in range, symptoms not in range)
def test_invalid_severity_returns_422(client):
    payload = {**valid_payload, "severity": 9}
    response = client.post("/api/entries", json=payload)
    assert response.status_code == 422 
 
 
def test_missing_severity_returns_422(client):
    payload = {k: v for k, v in valid_payload.items() if k != "severity"}
    response = client.post("/api/entries", json=payload)
    assert response.status_code == 422
 
 
def test_future_date_returns_422(client):
    tomorrow = (get_today_NZT() + timedelta(days=1)).isoformat()
    payload = {**valid_payload, "date": tomorrow}
    response = client.post("/api/entries", json=payload)
    assert response.status_code == 422


def test_unknown_symptom_returns_422(client):
    payload = {**valid_payload, "symptoms": ["elbow"]}
    response = client.post("/api/entries", json=payload)
    assert response.status_code == 422
 
 
def test_malformed_json_body_returns_422(client):
    response = client.post(
        "/api/entries",
        content="not valid json",
        headers={"Content-Type": "application/json"},
    )
    assert response.status_code == 422

def normalize_timestamp(ts_str: str) -> str:
  # Replace 'Z' with '+00:00' to unify formats
  return ts_str.replace("Z", "+00:00")

# PUT
def test_upsert_entry_when_exist_success(client: TestClient, session: Session):
    """Happy path"""

    db_entry = create_existing_entry(session)
    initial_updated_at = db_entry.updated_at
    initial_created_at = db_entry.created_at

    payload = {
        "date": FIXED_TODAY.isoformat(), 
        "severity": 2,
        "symptoms": ["nose", "eyes"],
        "notes": "Contact with pets, outdoor",
        "honey": True,
        "location": test_location
    }

    response = client.put(
        f"/api/entries/{FIXED_TODAY.isoformat()}",
        json=payload
    )

    assert response.status_code == 200
    data = response.json()
    assert data["severity"] == 2
    assert data["symptoms"] == ["nose", "eyes"]
    assert data["notes"] == "Contact with pets, outdoor"
    assert data["honey"]
    assert data["id"] == str(db_entry.id)  # same row, not a new one
    assert normalize_timestamp(data["created_at"]) == initial_created_at.isoformat() # created_at should not change
    assert normalize_timestamp(data["updated_at"]) != initial_updated_at.isoformat()


def test_upsert_when_not_exists(client: TestClient):
    payload = {**valid_payload, "date": "2026-08-25"}
    res = client.put("/api/entries/2026-08-25", json=payload)

    assert res.status_code == 200
    result = res.json()
    assert result["date"] == "2026-08-25"
    assert result["severity"] == valid_payload["severity"]
    assert result["symptoms"] == valid_payload["symptoms"]
    assert result["notes"] == valid_payload["notes"]
    assert result["location"] == valid_payload["location"]
    assert result["honey"] == valid_payload["honey"]


def test_upsert_ignore_date_on_update(client: TestClient, session: Session):
    create_existing_entry(session)

    payload = {**valid_payload, "date": "2026-08-25"}
    res = client.put(f"/api/entries/{FIXED_TODAY.isoformat()}", json=payload)
    assert res.json()["date"] == FIXED_TODAY.isoformat()  # URL wins, not payload


@pytest.mark.parametrize(
    "invalid_date", 
    [
        pytest.param("invalid-date", id="malformed_string"),
        pytest.param("9999-99-99", id="invalid_month_day"),
        pytest.param(date.today() + timedelta(days=2), id="future_date"),
    ]
)
def test_upsert_entry_invalid_date_returns_422(client, invalid_date):
    res = client.put(f"/api/entries/{invalid_date}", json=valid_payload)
    assert res.status_code == 422


@pytest.mark.parametrize(
    "invalid_data", 
    [
        pytest.param({**valid_payload, "severity": 4}, id="severity_out_of_range"),
        pytest.param({**valid_payload, "severity": -1}, id="severity_negative"),
        pytest.param({**valid_payload, "symptoms": ["elbow"]}, id="unknown_symptoms"),
        pytest.param({**valid_payload, "symptoms": ["eyes", "elbow"]}, id="known_and_unknown_symptoms"),
        pytest.param({**valid_payload, "notes": "a"*256}, id="notes_greater_than_255"),
    ]
)
def test_update_entry_invalid_input_returns_422(client, invalid_data):
    res = client.put(f"/api/entries/{valid_payload["date"]}", json=invalid_data)
    assert res.status_code == 422

# GET /api/entries/ happy path

def test_get_entries_default_days_returns_last_7_days(client, session):
    create_existing_entry(session, FIXED_TODAY.isoformat())
    create_existing_entry(session, (FIXED_TODAY - timedelta(days=6)).isoformat())
    create_existing_entry(session, (FIXED_TODAY - timedelta(days=7)).isoformat())  # out of range

    response = client.get("/api/entries/")

    assert response.status_code == 200
    dates = [entry["date"] for entry in response.json()]
    assert dates == [
        (FIXED_TODAY - timedelta(days=6)).isoformat(),
        FIXED_TODAY.isoformat(),
    ]


def test_get_entries_custom_days(client, session):
    create_existing_entry(session, (FIXED_TODAY - timedelta(days=29)).isoformat())
    create_existing_entry(session, (FIXED_TODAY - timedelta(days=30)).isoformat())  # out of range

    response = client.get("/api/entries/", params={"days": 30})

    assert response.status_code == 200
    dates = [entry["date"] for entry in response.json()]
    assert dates == [(FIXED_TODAY - timedelta(days=29)).isoformat()]


def test_get_entries_empty_when_no_entries(client):
    response = client.get("/api/entries/")

    assert response.status_code == 200
    assert response.json() == []


# --- validation ---

@pytest.mark.parametrize(
    "days_value",
    [
        pytest.param(0, id="zero"),
        pytest.param(-1, id="negative"),
        pytest.param(121, id="over_max"),
    ],
)
def test_get_entries_rejects_invalid_days(client, days_value):
    response = client.get("/api/entries/", params={"days": days_value})
    assert response.status_code == 422


def test_get_entries_rejects_non_integer_days(client):
    response = client.get("/api/entries/", params={"days": "a-week"})
    assert response.status_code == 422


def test_get_entries_boundary_days_accepted(client):
    # days=1 and days=120 are the inclusive edges — should NOT 422
    response_low = client.get("/api/entries/", params={"days": 1})
    response_high = client.get("/api/entries/", params={"days": 120})

    assert response_low.status_code == 200
    assert response_high.status_code == 200


# --- auth / isolation ---

def test_get_entries_only_returns_current_users_entries(client, session):
    other_user_id = uuid4()

    create_test_user(session, other_user_id)


    # session.exec(
    #     text("""
    #         INSERT INTO auth.users (id, email, encrypted_password, aud, role)
    #         VALUES (:id, :email, '', 'authenticated', 'authenticated')
    #     """),
    #     params={"id": other_user_id, "email": f"{other_user_id}@test.local"},
    # )
    # session.commit()

    create_existing_entry(session, FIXED_TODAY)

    other_entry = Entry(**{**valid_payload, "date": FIXED_TODAY}, user_id=other_user_id)
    session.add(other_entry)
    session.commit()

    response = client.get("/api/entries/")

    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["date"] == FIXED_TODAY.isoformat()