import requests
import re
from datetime import date, datetime
from zoneinfo import ZoneInfo
from sqlmodel import select

from app.core.config import get_settings
from app.core.deps import SessionDep
from app.schemas.pollen_forecast import PollenForecast

settings = get_settings()
today = datetime.now(ZoneInfo("Pacific/Auckland")).date()
location_paths = {
    "christchurch_central": "/towns-cities/regions/christchurch/locations/christchurch"
}
METSERVICE_ALLERGEN_PATH = "/publicData/webdata{location_path}/airborne-allergens"


def fetch_allergen_data(location: str) -> dict[str, str]:
    """
    Fetch the pollen forecast using the given location path.

    Args:
        location_path: URL path segment identifying the region/location,
            e.g. "/towns-cities/regions/christchurch/locations/christchurch".

    Returns:
        The parsed JSON response body as a Python dict.
    """
    location_path = location_paths[location.lower()]
    url = str(settings.metservice_base_url) + METSERVICE_ALLERGEN_PATH.format(
        location_path=location_path
    )
    result = requests.get(url)
    return result.json()


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


def extract_allergen_data(location: str) -> list[tuple]:
    """
    Fetch and parse allergen data, keeping only content items whose type
    is "iconWithText".

    Returns:
        A list of {risk: allergens list} mappings.
    """
    response = fetch_allergen_data(location)
    # TODO Add error handling, try-except
    content = response["layout"]["primary"]["slots"]["main"]["modules"][0]["content"]
    allergens = [
        parse_allergen_data(item["html"])
        for item in content
        if item.get("type") == "iconWithText"
    ]
    return allergens

def create_allergen_data(allergen_data: dict, db: SessionDep) -> PollenForecast:
    """
    Insert extracted daily allergen data into database.

    """
    data = PollenForecast(**allergen_data)
    db.add(data)
    db.commit()
    db.refresh(data)
    return data


def get_allergen_data(check_date: date, location: str, db: SessionDep) -> PollenForecast | None:
    statement = select(PollenForecast).where(
        PollenForecast.date == check_date,
        PollenForecast.location == location,
    )
    return db.exec(statement).first()


def build_forecast_payload(parsed: list[tuple[str, list[str]]], location: str) -> dict:
    payload = {
        "date": today,
        "location": location
    }
    valid_risks = {"imminent", "low", "moderate", "high"}
    for risk, allergens in parsed:
        if risk in valid_risks:
            payload[risk] = allergens
        #TODO log unexpected risk
    return payload


def sync_allergen_data(location: str, db: SessionDep) -> PollenForecast:
    todays_forecast = get_allergen_data(today, location, db)
    if todays_forecast is None:
        allergen_data = extract_allergen_data(location)
        payload = build_forecast_payload(allergen_data, location)
        todays_forecast = create_allergen_data(payload, db)
    return todays_forecast

    