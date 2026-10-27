"""
13/Jul/26 Schema Update
Goal    - To capture plant list by their respective pollen level. 
Reason  - To closely mirror the JSON returned by source API
How     - Plant list will be stored in db using JSONB, with pollen level as field name
Adopting ELT (Extract, Load, Transform), collect first, transform later 
"""

from datetime import UTC, datetime
from datetime import date as date_type
from uuid import UUID, uuid4

from sqlalchemy.dialects.postgresql import JSONB
from sqlmodel import Field, SQLModel


class PollenForecastBase(SQLModel):
    date: date_type
    location: str
    imminent: list[str] = Field(default=[], sa_type=JSONB)
    low: list[str] = Field(default=[], sa_type=JSONB)
    moderate: list[str] = Field(default=[], sa_type=JSONB)
    high: list[str] = Field(default=[], sa_type=JSONB)

class PollenForecast(PollenForecastBase, table=True):
    __tablename__ = "daily_pollen_forecasts"
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    checked_at: datetime = Field(default_factory=lambda: datetime.now(UTC))

class PollenForecastPublic(PollenForecastBase):
    pass