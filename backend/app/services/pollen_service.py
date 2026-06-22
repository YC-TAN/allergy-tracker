import requests

location = "christchurch"
allergen_url = f"https://www.metservice.com/publicData/webdata/towns-cities/regions/{location}/locations/{location}/airborne-allergens"

result = requests.get(allergen_url)
parsed_result = result.json()

allergen_forecast_raw = parsed_result["layout"]["primary"]["slots"]["main"]["modules"][0]["content"][0]["html"]