from sqlmodel import SQLModel, Field
from sqlalchemy.dialects.postgresql import JSONB
from datetime import date as date_type, datetime, timezone
from uuid import UUID, uuid4


class EntryBase(SQLModel):
    date: date_type
    severity: str
    symptoms: list[str] = Field(default=[], sa_type=JSONB)
    notes: str | None = Field(default=None)


class Entry(EntryBase, table=True):
    __tablename__ = "entries"
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class EntryCreate(EntryBase):
    pass
