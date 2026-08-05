from enum import Enum
from sqlmodel import SQLModel, Field
from sqlalchemy.dialects.postgresql import JSONB
from datetime import date as date_type, datetime, timezone
from uuid import UUID, uuid4


class SeverityLevel(int, Enum):
    no_symptom = 0
    mild = 1
    moderate = 2
    severe = 3


class Symptom(str, Enum):
    eyes = "eyes"
    nose = "nose"
    throat = "throat"
    energy = "energy"
    headache = "headache"
    other = "other"


class EntryBase(SQLModel):
    date: date_type
    severity: SeverityLevel
    #TODO deduplicate the list - prevent storing duplicate symptoms
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

