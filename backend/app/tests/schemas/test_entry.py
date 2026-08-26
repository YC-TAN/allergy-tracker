"""
Test the schema's business logic.
Verify that validation rules are configured as intended.
"""

import pytest
from datetime import date, timedelta
from pydantic import ValidationError
from typing import get_args

from app.schemas.entry import EntryUpsert
from app.schemas.locations_literal import Valid_locations

test_date = "2026-08-01"
test_location = get_args(Valid_locations)[0] # "Alexandra"
payload = {
        "date": test_date,
        "severity": 2,
        "symptoms": ["eyes", "nose", "headache"],
        "notes": "pets",
        "location": test_location
    }

def test_entry_create_accepts_full_valid_payload():
    entry = EntryUpsert(**payload)

    assert entry.date.isoformat() == test_date
    assert entry.severity == payload["severity"]
    assert entry.symptoms == payload["symptoms"]
    assert entry.notes == payload["notes"]
    assert entry.location == test_location


# --- severity ---

def test_severity_accepts_valid_range():
    for value in range(4):      # 0, 1, 2, 3
        data = {**payload, "severity":value}
        entry = EntryUpsert(**data)
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
        data = {**payload, "severity":severity_level}
        EntryUpsert(**data)


def test_severity_is_required():
    with pytest.raises(ValidationError):
        EntryUpsert(date=test_date, location=test_location)


# --- symptoms ---

def test_symptoms_accepts_known_values():
    data = {**payload, "symptoms":["eyes", "nose", "throat", "energy", "headache", "other"]}
    entry = EntryUpsert(**data)

    assert len(entry.symptoms) == 6


def test_symptoms_defaults_empty():
    entry = EntryUpsert(date=test_date, severity=0, location=test_location)
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
        data = {**payload, "symptoms": symptoms_list}
        EntryUpsert(**data)


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
    data = {**payload, "symptoms": symptoms_input}
    entry = EntryUpsert(**data)
    assert entry.symptoms == expected


# --- notes ---

def test_notes_accepts_empty_str():
    data = {**payload, "notes": ""}            
    entry = EntryUpsert(**data)
    assert entry.notes == ""


def test_notes_defaults_empty_str():
    entry = EntryUpsert(date=test_date, severity=0, location=test_location)
    assert entry.notes == ""


def test_notes_accepts_up_to_255_chars():
    data = {**payload, "notes": "a" * 255}
    entry = EntryUpsert(**data)
    assert len(entry.notes) == 255


def test_notes_rejects_over_255_chars():
    with pytest.raises(ValidationError):
        data = {**payload, "notes": "a" * 256}
        EntryUpsert(**data)


@pytest.mark.parametrize(
    "notes_input",
    [
        pytest.param("   ", id="spaces_only"),
        pytest.param("\t\n", id="tabs_and_newlines"),
    ],
)
def test_notes_whitespace_only_becomes_empty_str(notes_input):
    data = {**payload, "notes": notes_input}
    entry = EntryUpsert(**data)
    assert entry.notes == ""


@pytest.mark.parametrize(
    "notes_input, expected",
    [
        pytest.param(" test   ", "test", id="spaces_only"),
        pytest.param("\ttest\n", "test", id="tabs_and_newlines"),
        pytest.param("a"*255 + " ", "a"*255, id="255_chars_exactly_after_spaces_are_removed")
    ],
)
def test_notes_whitespace_is_removed(notes_input, expected):   
    data = {**payload, "notes": notes_input}
    entry = EntryUpsert(**data)
    assert entry.notes == expected


# --- date ---

def test_date_is_required():
    with pytest.raises(ValidationError):
        EntryUpsert(severity=1, location=test_location)


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
        data = {**payload, "date": date_input}
        EntryUpsert(**data)


def test_date_rejects_future_date():
    tomorrow = date.today() + timedelta(days=1)

    with pytest.raises(ValueError, match="Date cannot be in the future"):
        data = {**payload, "date": tomorrow}
        EntryUpsert(**data)

# -- location --

def test_location_accepts_any_valid_value():
    # every value in the Literal should be accepted — cheap to check them all at once
    for loc in get_args(Valid_locations):
        data = {**payload, "location": loc}
        entry = EntryUpsert(**data)
        assert entry.location == loc


def test_location_rejects_invalid_value():
    with pytest.raises(ValidationError):
        EntryUpsert(**{**payload, "location": "Not A Real Place"})


def test_location_is_case_sensitive():
    with pytest.raises(ValidationError):
        EntryUpsert(**{**payload, "location": "alexandra"})


def test_location_rejects_empty_string():
    with pytest.raises(ValidationError):
        EntryUpsert(**{**payload, "location": ""})


def test_location_rejects_none():
    with pytest.raises(ValidationError):
        EntryUpsert(**{**payload, "location": None})


def test_location_rejects_wrong_type():
    with pytest.raises(ValidationError):
        EntryUpsert(**{**payload, "location": 123})

