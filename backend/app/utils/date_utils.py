"""Utilities for working with New Zealand dates."""

from datetime import date, datetime
from typing import Annotated
from zoneinfo import ZoneInfo
from pydantic import AfterValidator

NZ_TZ = ZoneInfo("Pacific/Auckland")


def get_today_NZT() -> date:
    """Return today's date in the Pacific/Auckland timezone.

    Returns:
        date: A Python ``datetime.date`` object representing the current
            New Zealand local date, for example ``2026-09-11``.
    """
    return datetime.now(NZ_TZ).date()


def not_future_date(v: date) -> date:
    """Validate that a date is not later than the current New Zealand date.

    Args:
        v (date): The date to validate.

    Returns:
        date: The validated date when it is not in the future.

    Raises:
        ValueError: If the supplied date is after the current New Zealand date.
    """
    if v > get_today_NZT():
        raise ValueError("Date cannot be in the future")
    return v


NotFutureDate = Annotated[date, AfterValidator(not_future_date)]
