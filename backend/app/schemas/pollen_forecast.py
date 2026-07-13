"""
13/Jul/26 Schema Update
Goal    - To capture plant list by their respective pollen level. 
Reason  - To closely mirror the JSON returned by source API
How     - Plant list will be stored in db using JSON, with its level as field name
Adopting ELT (Extract, Load, Transform), collect first, transform later 
"""

from sqlmodel import SQLModel, Field
from sqlalchemy import JSON
from typing import Literal, List
from datetime import date as date_type, datetime
from uuid import UUID, uuid4

PollenRisk = Literal["low", "moderate", "high", "imminent"]

class PollenForecastBase(SQLModel):
    date: date_type
    location: str
    imminent: List[str] = Field(default=[], sa_type=JSON)
    low: List[str] = Field(default=[], sa_type=JSON)
    high: List[str] = Field(default=[], sa_type=JSON)
    checked_at: datetime

class PollenForecast(PollenForecastBase, table=True):
    __tablename__ = "daily_pollen_forecasts"
    id: UUID = Field(default_factory=uuid4, primary_key=True)

class PollenForecastPublic(PollenForecastBase):
    pass