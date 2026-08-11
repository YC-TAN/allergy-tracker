import pytest
from datetime import date, timedelta
from app.schemas.entry import Entry

VALID_PAYLOAD = {
    "date": "2026-08-01", 
    "severity": 1, 
    "symptoms": ["nose"], 
    "notes": "Contact with pets" 
}

# GET: Happy path
def test_get_entry_by_date(client, session):
    entry = Entry(**VALID_PAYLOAD)    # write to db table directly
    session.add(entry)
    session.commit()

    res = client.get("/entries/2026-08-01")
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
        pytest.param("2026-12-25", 404, id="valid_format_no_entry"),
        pytest.param("invalid-date", 422, id="malformed_string"),
        pytest.param("9999-99-99", 422, id="invalid_month_day"),
    ]
)
def test_get_entry_invalid_or_not_exist(client, invalid_date, expected_status):
    res = client.get(f"/entries/{invalid_date}")
    assert res.status_code == expected_status


# POST: Happy
def test_create_entry_success(client):
    post_res = client.post("/entries/", json=VALID_PAYLOAD)
    assert post_res.status_code == 201

    post_result = post_res.json()
    assert "id" in post_result 
    assert "created_at" in post_result 
    assert "updated_at" in post_result 
    assert post_result["date"] == VALID_PAYLOAD["date"]
    assert post_result["severity"] == VALID_PAYLOAD["severity"]
    assert post_result["symptoms"] == VALID_PAYLOAD["symptoms"]
    assert post_result["notes"] == VALID_PAYLOAD["notes"]

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
    assert result["notes"] is None


# POST: Negative cases (wrong date format, future date, no severity, severity not in range, symptoms not in range)
def test_invalid_severity_returns_422(client):
    payload = {**VALID_PAYLOAD, "severity": 9}
    response = client.post("/entries/", json=payload)
    assert response.status_code == 422 
 
 
def test_missing_severity_returns_422(client):
    payload = {k: v for k, v in VALID_PAYLOAD.items() if k != "severity"}
    response = client.post("/entries/", json=payload)
    assert response.status_code == 422
 
 
def test_future_date_returns_422(client):
    tomorrow = (date.today() + timedelta(days=1)).isoformat()
    payload = {**VALID_PAYLOAD, "date": tomorrow}
    response = client.post("/entries/", json=payload)
    assert response.status_code == 422


def test_unknown_symptom_returns_422(client):
    payload = {**VALID_PAYLOAD, "symptoms": ["elbow"]}
    response = client.post("/entries/", json=payload)
    assert response.status_code == 422
 
 
def test_malformed_json_body_returns_422(client):
    response = client.post(
        "/entries/",
        content="not valid json",
        headers={"Content-Type": "application/json"},
    )
    assert response.status_code == 422