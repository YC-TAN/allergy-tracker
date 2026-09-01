import json
import re
import httpx2
import logging
from pathlib import Path

from app.core.config import get_settings
from app.core.deps import SessionDep
from app.schemas.pollen_forecast import PollenForecast
from app.utils.date_utils import get_today_NZT
from app.repository import pollen as pollen_repo
from app.errors.app_error import PollenFetchError, UnsupportedLocationError


logger = logging.getLogger(__name__)
settings = get_settings()

_LOCATION_PATHS_FILE = Path(__file__).parent / "data" / "location_paths.json"
with open(_LOCATION_PATHS_FILE) as f:
    location_paths = json.load(f)


def construct_url(location: str) -> str:

    try:
        location_path = location_paths[location]
    except KeyError as e:
        raise UnsupportedLocationError(location) from e

    return str(settings.metservice_base_url) + settings.metservice_allergen_path.format(location_path=location_path)


async def fetch_allergen_data(location: str) -> dict[str, str]:
    """Fetch the pollen forecast using the given location path.

    Args:
        location (str):

    Returns:
        The parsed JSON response body as a Python dict.
    """
    url = construct_url(location)

    try:
        async with httpx2.AsyncClient() as client:                       
            r = await client.get(url)
            r.raise_for_status()
    except httpx2.HTTPError as e:
        raise PollenFetchError(location) from e
    return r.json()


def parse_allergen_data(content: str) -> tuple[str, list[str]] | None:
    """
    Extract the risk level and allergen plants from a single HTML fragment.

    Args:
        e.g. '<span class="status-good">Imminent</span></br>Hazelnut, Alder</br>'

    Returns:
        A dict mapping the risk level to a list of plant names, or None
        if the fragment doesn't match the expected pattern.
    """
    match = re.match(r'<span class="[^"]+"[^>]*>([^<]+)</span></br>(.+?)</br>', content)
    if not match:
        return None
    risk_word, plants_str = match.groups()
    risk = risk_word.lower().strip()
    return (risk, [p.strip().lower() for p in plants_str.split(",") if p.strip()])


async def extract_allergen_data(location: str) -> list[tuple]:
    """
    Fetch and parse allergen data, keeping only content items whose type
    is "iconWithText".

    Returns:
        A list of {risk: allergens list} mappings.
    """
    response = await fetch_allergen_data(location)

    try:
        content = response["layout"]["primary"]["slots"]["main"]["modules"][0]["content"]
    except (KeyError, IndexError, TypeError) as e:
        raise PollenFetchError(location) from e

    allergens = [
        parse_allergen_data(item["html"])
        for item in content
        if item.get("type") == "iconWithText" and parse_allergen_data(item["html"]) is not None
    ]
    return allergens


def build_forecast_payload(parsed: list[tuple[str, list[str]]], location: str) -> dict:
    payload = {
        "date": get_today_NZT(),
        "location": location
    }
    valid_risks = {"imminent", "low", "moderate", "high"}
    for risk, allergens in parsed:
        if risk in valid_risks:
            payload[risk] = allergens
        else:
            logger.warning("Unexpected risk level %r for location %r", risk, location)

    if len(payload) == 2:  # only date/location got set, nothing matched
        raise PollenFetchError(location)

    return payload


async def sync_allergen_data(location: str, db: SessionDep) -> PollenForecast:
    today = get_today_NZT()
    todays_forecast = pollen_repo.get_allergen_data(today, location, db)
    if todays_forecast is None:
        allergen_data = await extract_allergen_data(location)
        payload = build_forecast_payload(allergen_data, location)
        todays_forecast = pollen_repo.create_allergen_data(payload, db)
    return todays_forecast

    