import requests

location = "christchurch-airport_christchurch"

url = f"https://www.metservice.com//publicData/webdata/module/twoDayForecast/93781/{location}"

result = requests.get(url)
parsed_result = result.json()

next_day_forecast = parsed_result["days"][1]["forecasts"][0]

min_temp = next_day_forecast["highTemp"]
max_temp = next_day_forecast["lowTemp"]
forecast_statement = next_day_forecast["statement"]
sunrise = next_day_forecast["sunrise"]