"""
Entry schema models for tracking daily logs.

11/Aug/26 Update Enum classes
Goal    - To fix the Enum bug
Reason  - sa_type=Integer doesn't translate enum restriction to DB
How     - Hardcode severityLevel using Literal
        - Change Symptom to Literal type
Note    - Keep severityLevel as Enum to preserve the meaning of the number.
        - Must manually update if severityLevel values change
"""

from enum import Enum
from typing import Literal
from sqlmodel import SQLModel, Field
from pydantic import field_validator
from sqlalchemy import Integer, String
from sqlalchemy.dialects.postgresql import JSONB
from datetime import datetime, timezone
from uuid import UUID, uuid4

from .locations_literal import Valid_locations
from app.utils.date_utils import NotFutureDate


class SeverityLevel(int, Enum):
    """Severity options for daily allergy entries."""

    no_symptoms = 0
    mild = 1
    moderate = 2
    severe = 3

Symptom = Literal["eyes", "nose", "throat", "energy", "headache", "other"]


class EntryBase(SQLModel):
    """Shared fields and validation for allergy entry."""

    date: NotFutureDate
    severity: Literal[0, 1, 2, 3] = Field(
        sa_type=Integer,
        description="0 = no symptoms, 1 = mild, 2 = moderate, 3 = severe",
    )
    symptoms: list[Symptom] = Field(
        default=[],
        sa_type=JSONB,
        title="Hay Fever Symptoms",
        description="Multiselect: 'eyes', 'nose', 'throat', 'energy', 'headache', 'other'",
    )
    notes: str = Field(
        default="", max_length=255, title="Additional information"
    )

    location: Valid_locations = Field(sa_type=String)

    @field_validator("notes", mode="before")
    @classmethod
    def normalize_notes(cls, v: str | None) -> str:
        if v is None:
            return ""
        return v.strip()

    @field_validator("symptoms")
    @classmethod
    def deduplicate_symptoms(cls, v: list[Symptom]) -> list[Symptom]:
        return list(dict.fromkeys(v))  # dict to keep insertion order, keys are unique


class Entry(EntryBase, table=True):
    """Database table model for persisted allergy entries."""

    __tablename__ = "entries"
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    user_id: UUID # from auth token
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class EntryUpsert(EntryBase):
    """Payload model for creating / updating a new allergy entry."""
    pass


# class EntryUpdate(EntryBase):
#     """Payload model for updating an existing allergy entry."""
#     pass


class EntryResponse(EntryBase):
    """Response model for returning entry data through the API."""

    id: UUID
    created_at: datetime
    updated_at: datetime


class MigrateRequest(SQLModel):
    entries: list[EntryUpsert]

class MigrateResponse(SQLModel):
    synced: list[EntryResponse]
    failed: list[str]   # dates still unsynced — client keeps these as _synced: false