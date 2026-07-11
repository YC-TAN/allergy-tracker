from sqlmodel import SQLModel, Field, Column
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy import String
from typing import Literal
from datetime import date as date_type, datetime
from uuid import UUID, uuid4
from enum import Enum

PollenRisk = Literal["low", "moderate", "high", "imminent", "unknown"]

class PollenForecastBase(SQLModel):
    date: date_type
    location: str
    pollen_info: str                                     
    risk: PollenRisk
    checked_at: datetime

class PollenForecast(PollenForecastBase, table=True):
    __tablename__ = "daily_pollen_forecasts"
    id: UUID = Field(default_factory=uuid4, primary_key=True)

class PollenForecastPublic(PollenForecastBase):
    pass