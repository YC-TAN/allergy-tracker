import requests
import re
from app.config import get_settings

settings = get_settings()
location = "Christchurch Central"
location_path = "/towns-cities/regions/christchurch/locations/christchurch"
METSERVICE_ALLERGEN_PATH = "/publicData/webdata{location_path}/airborne-allergens"


def fetch_allergen_data(location_path: str) -> dict:
    """
    Fetch the pollen forecast using the given location path.

    Args:
        location_path: URL path segment identifying the region/location,
            e.g. "/towns-cities/regions/christchurch/locations/christchurch".

    Returns:
        The parsed JSON response body as a Python dict.
    """

    url = str(settings.metservice_base_url) + METSERVICE_ALLERGEN_PATH.format(
        location_path=location_path
    )
    result = requests.get(url)
    return result.json()


def parse_allergen_data(content: str) -> dict:
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
    return {risk: [p.strip().lower() for p in plants_str.split(",") if p.strip()]}


def extract_allergen_data(location_path: str) -> list[dict]:
    """
    Fetch and parse allergen data, keeping only content items whose type
    is "iconWithText".

    Returns:
        A list of {risk: allergens list} mappings.
    """
    response = fetch_allergen_data(location_path)
    # TODO Add error handling, try-except
    content = response["layout"]["primary"]["slots"]["main"]["modules"][0]["content"]
    allergens = [
        parse_allergen_data(item["html"])
        for item in content
        if item.get("type") == "iconWithText"
    ]
    return allergens
