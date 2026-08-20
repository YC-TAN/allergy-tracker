import pytest
from datetime import date, timedelta
from fastapi.testclient import TestClient
from sqlmodel import Session
from app.schemas.entry import Entry

VALID_PAYLOAD = {
    "date": "2026-08-01", 
    "severity": 1, 
    "symptoms": ["nose"], 
    "notes": "Contact with pets" 
}

def create_existing_entry(session: Session):
    entry = Entry(**VALID_PAYLOAD)    # write to db table directly
    session.add(entry)
    session.commit()
    session.refresh(entry)
    return entry

# GET: Happy path
def test_get_entry_by_date_success(client, session):
    create_existing_entry(session)

    res = client.get("/api/entries/2026-08-01")
    result = res.json()

    assert res.status_code == 200
    assert result["date"] == VALID_PAYLOAD["date"]
    assert result["severity"] == VALID_PAYLOAD["severity"]
    assert result["symptoms"] == VALID_PAYLOAD["symptoms"]
    assert result["notes"] == VALID_PAYLOAD["notes"]


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
def test_create_entry_success(client):
    post_res = client.post("/api/entries", json=VALID_PAYLOAD)
    assert post_res.status_code == 201

    post_result = post_res.json()
    assert "id" in post_result 
    assert "created_at" in post_result 
    assert "updated_at" in post_result 
    assert post_result["date"] == VALID_PAYLOAD["date"]
    assert post_result["severity"] == VALID_PAYLOAD["severity"]
    assert post_result["symptoms"] == VALID_PAYLOAD["symptoms"]
    assert post_result["notes"] == VALID_PAYLOAD["notes"]

    get_res = client.get("/api/entries/2026-08-01")
    assert get_res.status_code == 200
    assert get_res.json() == post_result 


# POST: default notes and symptoms
def test_create_entry_defaults_symptoms_and_notes(client):
    payload = {"date": "2026-08-03", "severity": 0}   # no symptoms, no notes
    res = client.post("/api/entries", json=payload)
    result = res.json()

    assert res.status_code == 201
    assert result["symptoms"] == []
    assert result["notes"] == ""


# POST: Negative cases (wrong date format, future date, no severity, severity not in range, symptoms not in range)
def test_invalid_severity_returns_422(client):
    payload = {**VALID_PAYLOAD, "severity": 9}
    response = client.post("/api/entries", json=payload)
    assert response.status_code == 422 
 
 
def test_missing_severity_returns_422(client):
    payload = {k: v for k, v in VALID_PAYLOAD.items() if k != "severity"}
    response = client.post("/api/entries", json=payload)
    assert response.status_code == 422
 
 
def test_future_date_returns_422(client):
    tomorrow = (date.today() + timedelta(days=1)).isoformat()
    payload = {**VALID_PAYLOAD, "date": tomorrow}
    response = client.post("/api/entries", json=payload)
    assert response.status_code == 422


def test_unknown_symptom_returns_422(client):
    payload = {**VALID_PAYLOAD, "symptoms": ["elbow"]}
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
def test_update_entry_by_date_success(client: TestClient, session: Session):
    """Happy path"""

    db_entry = create_existing_entry(session)
    initial_updated_at = db_entry.updated_at
    initial_created_at = db_entry.created_at

    payload = {
        "date": VALID_PAYLOAD['date'], 
        "severity": 2,
        "symptoms": ["nose", "eyes"],
        "notes": "Contact with pets, outdoor"
    }

    response = client.put(
        f"/api/entries/{VALID_PAYLOAD['date']}",
        json=payload
    )

    assert response.status_code == 200
    data = response.json()
    assert data["severity"] == 2
    assert data["symptoms"] == ["nose", "eyes"]
    assert data["notes"] == "Contact with pets, outdoor"
    assert data["id"] == str(db_entry.id)  # same row, not a new one
    assert normalize_timestamp(data["created_at"]) == initial_created_at.isoformat() # created_at should not change
    assert normalize_timestamp(data["updated_at"]) != initial_updated_at.isoformat()
 

@pytest.mark.parametrize(
    "invalid_date", 
    [
        pytest.param("invalid-date", id="malformed_string"),
        pytest.param("9999-99-99", id="invalid_month_day"),
    ]
)
def test_update_entry_invalid_date_returns_422(client, invalid_date):
    res = client.put(f"/api/entries/{invalid_date}", json=VALID_PAYLOAD)
    assert res.status_code == 422


def test_update_not_found_returns_404(client: TestClient):
    res = client.put(f"/api/entries/{date.today() + timedelta(days=2)}", json=VALID_PAYLOAD)
    assert res.status_code == 404


@pytest.mark.parametrize(
    "invalid_data", 
    [
        pytest.param({**VALID_PAYLOAD, "severity": 4}, id="severity_out_of_range"),
        pytest.param({**VALID_PAYLOAD, "severity": -1}, id="severity_negative"),
        pytest.param({**VALID_PAYLOAD, "symptoms": ["elbow"]}, id="unknown_symptoms"),
        pytest.param({**VALID_PAYLOAD, "symptoms": ["eyes", "elbow"]}, id="known_and_unknown_symptoms"),
        pytest.param({**VALID_PAYLOAD, "notes": "a"*256}, id="notes_greater_than_255"),
    ]
)
def test_update_entry_invalid_input_returns_422(client, invalid_data):
    res = client.put(f"/api/entries/{VALID_PAYLOAD["date"]}", json=invalid_data)
    assert res.status_code == 422