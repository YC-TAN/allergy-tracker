from datetime import timedelta

from app.services.entry_service import get_entries_range
from app.tests.utils import create_existing_entry, TEST_USER_ID, FIXED_TODAY


def test_last_7_days_ending_today(session):
    create_existing_entry(session, FIXED_TODAY)                      # in range
    create_existing_entry(session, FIXED_TODAY - timedelta(days=6))  # in range (boundary)
    create_existing_entry(session, FIXED_TODAY - timedelta(days=7))  # out of range

    result = get_entries_range(session, TEST_USER_ID, days=7)

    assert [e.date for e in result] == [
        FIXED_TODAY - timedelta(days=6),
        FIXED_TODAY,
    ]


def test_last_30_days(session):
    create_existing_entry(session, FIXED_TODAY - timedelta(days=29))  # in range for 30d
    create_existing_entry(session, FIXED_TODAY - timedelta(days=30))  # out of range for 30d

    result = get_entries_range(session, TEST_USER_ID, days=30)

    assert [e.date for e in result] == [FIXED_TODAY - timedelta(days=29)]


# --- fencepost / off-by-one ---

def test_days_one_returns_single_day_range(session):
    create_existing_entry(session, FIXED_TODAY)                      # in range
    create_existing_entry(session, FIXED_TODAY - timedelta(days=1))  # out of range

    result = get_entries_range(session, TEST_USER_ID, days=1)

    assert [e.date for e in result] == [FIXED_TODAY]


def test_days_seven_returns_exactly_seven_calendar_dates(session):
    for offset in range(10):  # seed 10 consecutive days
        create_existing_entry(session, FIXED_TODAY - timedelta(days=offset))

    result = get_entries_range(session, TEST_USER_ID, days=7)

    assert len(result) == 7
    assert result[0].date == FIXED_TODAY - timedelta(days=6)
    assert result[-1].date == FIXED_TODAY