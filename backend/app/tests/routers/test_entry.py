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
    entry = Entry(**payload)
    session.add(entry)
    session.commit()

    from sqlmodel import select
    check = session.exec(select(Entry).where(Entry.date == entry.date)).first()
    assert check is not None, "row not found even via direct session query"

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
# POST: default notes and symptoms
# POST: Negative cases (wrong date format, future date, no severity, severity not in range, symptoms not in range)