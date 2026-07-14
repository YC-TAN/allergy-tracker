import requests
import re
from app.config import get_settings

settings = get_settings()
location = "Christchurch Central"
location_path = "/towns-cities/regions/christchurch/locations/christchurch"
METSERVICE_ALLERGEN_PATH = "/publicData/webdata{location_path}/airborne-allergens"

async def fetch_allergen_data(location_path: str) -> dict:
    """
    Extract data from item with type iconWithText
    """
    url = settings.metservice_base_url + METSERVICE_ALLERGEN_PATH.format(location_path=location_path)
    result = await requests.get(url)
    parsed_result = result.json()
    return parsed_result["layout"]["primary"]["slots"]["main"]["modules"][0]["content"]

def parse_allergen_data(html: str) -> dict:
    """
    Extract data from item with type iconWithText
    """
    match = re.match(r'<span class="[^"]+"[^>]*>([^<]+)</span></br>(.+?)</br>', html)
    if not match:
        return None
    risk_word, plants_str = match.groups()
    risk = risk_word.lower().strip()
    return {risk: [p.strip() for p in plants_str.split(",") if p.strip()]}

async def extract_allergen_data(location_path: str) -> dict:
    content = await fetch_allergen_data(location_path)
    allergens = [
        parse_allergen_data(item["html"])
        for item in content
        if item["type"] == "iconWithText"
    ]
    return allergens