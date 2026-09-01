from datetime import date, datetime
from typing import Annotated
from zoneinfo import ZoneInfo
from pydantic import AfterValidator


NZ_TZ = ZoneInfo("Pacific/Auckland")

def get_today_NZT() -> date:
    return datetime.now(NZ_TZ).date()


def not_future_date(v: date) -> date:
    if v > get_today_NZT():
        raise ValueError("Date cannot be in the future")
    return v

NotFutureDate = Annotated[date, AfterValidator(not_future_date)]