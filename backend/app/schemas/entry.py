from enum import Enum
from typing import Literal
from sqlmodel import SQLModel, Field
from pydantic import field_validator
from sqlalchemy import Integer
from sqlalchemy.dialects.postgresql import JSONB
from datetime import date as date_type, datetime, timezone
from uuid import UUID, uuid4


class SeverityLevel(int, Enum):
    no_symptoms = 0
    mild = 1
    moderate = 2
    severe = 3


Symptom = Literal["eyes", "nose", "throat", "energy", "headache", "other"]


class EntryBase(SQLModel):
    date: date_type
    severity: Literal[0, 1, 2, 3] = Field(
        sa_type=Integer, 
        description="0 = no symptoms, 1 = mild, 2 = moderate, 3 = severe"
    )
    symptoms: list[Symptom] = Field(
        default=[], 
        sa_type=JSONB,
        title="Hay Fever Symptoms",
        description="Multiselect: 'eyes', 'nose', 'throat', 'energy', 'headache', 'other'"
    )
    notes: str | None = Field(
        default=None,
        max_length=255,
        title="Additional information"
    )

    @field_validator("date")
    @classmethod
    def date_must_not_be_future(cls, v: date_type) -> date_type:
        if v > date_type.today():
            raise ValueError("Date cannot be in the future")
        return v

    @field_validator("notes", mode="before")
    @classmethod
    def normalize_notes(cls, v: str | None) -> str | None:
        if v is None:
            return v
        v = v.strip()
        return v or None  # empty after stripping → None

    @field_validator("symptoms")
    @classmethod
    def deduplicate_symptoms(cls, v: list[Symptom]) -> list[Symptom]:
        return list(dict.fromkeys(v))   # dict to keep insertion order, keys are unique


class Entry(EntryBase, table=True):
    __tablename__ = "entries"
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class EntryCreate(EntryBase):
    pass


class EntryUpdate(EntryBase):
    pass


class EntryResponse(EntryBase):
    pass

