import pytest
from app.schemas.entry import Entry

payload = {
    "date": "2026-08-01", 
    "severity": 1, 
    "symptoms": ["nose"], 
    "notes": "Contact with pets" 
}

# GET: Happy path
def test_get_entry_by_date(client, session):
    entry = Entry(**payload)    # write to db table directly
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
@pytest.mark.parametrize(
    "invalid_date, expected_status", 
    [
        pytest.param("2026-12-25", 404, id="valid_format_no_entry"),
        pytest.param("invalid-date", 422, id="malformed_string"),
        pytest.param("9999-99-99", 422, id="invalid_month_day"),
    ]
)
def test_get_entry_invalid_or_missing(client, invalid_date, expected_status):
    res = client.get(f"/entries/{invalid_date}")
    assert res.status_code == expected_status


# POST: Happy
def test_create_entry_success(client):
    post_res = client.post("/entries/", json=payload)
    assert post_res.status_code == 201

    post_result = post_res.json()
    assert "id" in post_result 
    assert "created_at" in post_result 
    assert "updated_at" in post_result 
    assert post_result["date"] == payload["date"]
    assert post_result["severity"] == payload["severity"]
    assert post_result["symptoms"] == payload["symptoms"]
    assert post_result["notes"] == payload["notes"]

    get_res = client.get("/entries/2026-08-01")
    assert get_res.status_code == 200
    assert get_res.json() == post_result 


# POST: default notes and symptoms
def test_post_entry_defaults_symptoms_and_notes(client):
    payload = {"date": "2026-08-03", "severity": 0}   # no symptoms, no notes
    res = client.post("/entries/", json=payload)
    result = res.json()

    assert res.status_code == 201
    assert result["symptoms"] == []
    assert result["notes"] == None


# POST: Negative cases (wrong date format, future date, no severity, severity not in range, symptoms not in range)