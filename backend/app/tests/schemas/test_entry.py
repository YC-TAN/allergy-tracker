"""
Test the schema's business logic.
Verify that validation rules are configured as intended.
"""

import pytest
from datetime import date, timedelta
from app.schemas.entry import EntryCreate
from pydantic import ValidationError

test_date = "2026-08-01"

def test_entry_create_accepts_full_valid_payload():
    payload = {
        "date": test_date,
        "severity": 2,
        "symptoms": ["eyes", "nose", "headache"],
        "notes": "pets",
    }
    entry = EntryCreate(**payload)

    assert entry.date.isoformat() == test_date
    assert entry.severity == payload["severity"]
    assert entry.symptoms == payload["symptoms"]
    assert entry.notes == payload["notes"]


# --- severity ---

def test_severity_accepts_valid_range():
    for value in range(4):      # 0, 1, 2, 3
        entry = EntryCreate(date=test_date, severity=value)
        assert entry.severity == value


@pytest.mark.parametrize(
    "severity_level", 
    [
        pytest.param(4, id="out_of_range"),
        pytest.param(-1, id="negative"),
        pytest.param("moderate", id="non_integer"),
    ],
)
def test_severity_rejects_invalid_values(severity_level):
    with pytest.raises(ValidationError):
        EntryCreate(
            date=test_date, 
            severity=severity_level
        )


def test_severity_is_required():
    with pytest.raises(ValidationError):
        EntryCreate(date=test_date)


# --- symptoms ---

def test_symptoms_accepts_known_values():
    entry = EntryCreate(
        date=test_date, 
        severity=1,
        symptoms=["eyes", "nose", "throat", "energy", "headache", "other"],
    )
    assert len(entry.symptoms) == 6


def test_symptoms_defaults_empty():
    entry = EntryCreate(date=test_date, severity=0)
    assert entry.symptoms == []


@pytest.mark.parametrize(
    "symptoms_list", 
    [
        pytest.param(["leg", "hand"], id="all_unknown"),
        pytest.param(["nose", "leg"], id="mixed_known_and_unknown"),
        pytest.param([""], id="empty_string"),
    ],
)
def test_symptoms_rejects_unknown_value(symptoms_list):
    with pytest.raises(ValidationError):
        EntryCreate(
            date=test_date, 
            severity=1, 
            symptoms=symptoms_list
        )


@pytest.mark.parametrize(
    "symptoms_input, expected",
    [
        pytest.param(["nose", "nose"], ["nose"], id="simple_duplicate"),
        pytest.param(["nose", "eyes", "nose"], ["nose", "eyes"], id="duplicate_preserves_first_position"),
        pytest.param(["nose", "nose", "nose"], ["nose"], id="triple_duplicate"),
        pytest.param([], [], id="empty_list")
    ],
)
def test_symptoms_deduplicates_repeated_values(symptoms_input, expected):
    entry = EntryCreate(date=test_date, severity=1, symptoms=symptoms_input)
    assert entry.symptoms == expected


# --- notes ---

def test_notes_accepts_none():
    entry = EntryCreate(date=test_date, severity=0, notes=None)
    assert entry.notes is None


def test_notes_accepts_up_to_255_chars():
    entry = EntryCreate(date=test_date, severity=1, notes="a" * 255)
    assert len(entry.notes) == 255


def test_notes_rejects_over_255_chars():
    with pytest.raises(ValidationError):
        EntryCreate(date=test_date, severity=1, notes="a" * 256)


@pytest.mark.parametrize(
    "notes_input",
    [
        pytest.param("   ", id="spaces_only"),
        pytest.param("\t\n", id="tabs_and_newlines"),
    ],
)
def test_notes_whitespace_only_becomes_none(notes_input):
    entry = EntryCreate(date=test_date, severity=0, notes=notes_input)
    assert entry.notes is None


@pytest.mark.parametrize(
    "notes_input, expected",
    [
        pytest.param(" test   ", "test", id="spaces_only"),
        pytest.param("\ttest\n", "test", id="tabs_and_newlines"),
        pytest.param("a"*255 + " ", "a"*255, id="255_chars_exactly_after_spaces_are_removed")
    ],
)
def test_notes_whitespace_is_removed(notes_input, expected):   
    entry = EntryCreate(date=test_date, severity=0, notes=notes_input)
    assert entry.notes == expected


# --- date ---

def test_date_is_required():
    with pytest.raises(ValidationError):
        EntryCreate(severity=1)


@pytest.mark.parametrize(
    "date_input", 
    [
        pytest.param("01-08-2026", id="invalid_ISO_format"),
        pytest.param("Not a date", id="not_a_date"),
        pytest.param("9999-99-99", id="invalid_date"),
    ],
)
def test_date_rejects_invalid_format(date_input):
    with pytest.raises(ValidationError):
        EntryCreate(
            date=date_input, 
            severity=0
        )


def test_date_rejects_future_date():
    tomorrow = date.today() + timedelta(days=1)


    with pytest.raises(ValueError, match="Date cannot be in the future"):
        EntryCreate(
            date=tomorrow,
            severity=1
        )