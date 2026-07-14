"""
13/Jul/26 Schema Update
Goal    - To capture plant list by their respective pollen level. 
Reason  - To closely mirror the JSON returned by source API
How     - Plant list will be stored in db using JSONB, with pollen level as field name
Adopting ELT (Extract, Load, Transform), collect first, transform later 
"""

from sqlmodel import SQLModel, Field
from sqlalchemy import JSONB
from typing import List
from datetime import date as date_type, datetime, timezone
from uuid import UUID, uuid4

class PollenForecastBase(SQLModel):
    date: date_type
    location: str
    imminent: List[str] = Field(default=[], sa_type=JSONB)
    low: List[str] = Field(default=[], sa_type=JSONB)
    high: List[str] = Field(default=[], sa_type=JSONB)

class PollenForecast(PollenForecastBase, table=True):
    __tablename__ = "daily_pollen_forecasts"
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    checked_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class PollenForecastPublic(PollenForecastBase):
    pass