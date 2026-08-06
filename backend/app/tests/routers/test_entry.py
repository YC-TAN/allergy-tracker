import pytest
from app.schemas.entry import Entry

payload = {
    "date": "2026-08-01", 
    "severity": 3, 
    "symptoms": ["nose"], 
    "notes": "Contact with pets" 
}

# GET: Happy path
def test_get_entry_by_date(client, session):
    entry = Entry(**payload)
    session.add(entry)
    session.commit()

    res = client.get("/entries/2026-08-01")
    result = res.json()
    assert res.status_code == 200
    assert result["date"] == payload["date"]
    assert result["severity"] == payload["severity"]
    assert result["symptoms"] == payload["symptoms"]
    assert result["notes"] == payload["notes"]


# GET: Negative case
@pytest.mark.parametrize("invalid_date, expected_status", [
    ("2026-08-01", 404),       # Valid format, but doesn't exist
    ("invalid-date", 422),     # Malformed date string (Pydantic / FastAPI validation error)
    ("9999-99-99", 422),       # Out of range date
])
def test_get_entry_invalid_or_missing(client, invalid_date, expected_status):
    res = client.get(f"/entries/{invalid_date}")
    assert res.status_code == expected_status

# POST: Happy
# POST: default notes and symptoms
# POST: Negative cases (wrong date format, future date, no severity, severity not in range, symptoms not in range)