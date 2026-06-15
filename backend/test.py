import openmeteo_requests

import pandas as pd
import requests_cache
from retry_requests import retry
import requests
import os

file = "weather.csv"

# Setup the Open-Meteo API client with cache and retry on error
cache_session = requests_cache.CachedSession('.cache', expire_after = 3600)
retry_session = retry(cache_session, retries = 5, backoff_factor = 0.2)
openmeteo = openmeteo_requests.Client(session = retry_session)

# Make sure all required weather variables are listed here
# The order of variables in hourly or daily is important to assign them correctly below
url = "https://api.open-meteo.com/v1/forecast"
params = {
	"latitude": -43.531,
	"longitude": 172.6364,
    "timezone": "Pacific/Auckland",
	"daily": [
        "relative_humidity_2m_max", 
        "wind_direction_10m_dominant", 
        "temperature_2m_max", 
        "temperature_2m_min", 
        "wind_speed_10m_max", 
        "wind_gusts_10m_max", 
        "precipitation_sum"
        ],
}
responses = openmeteo.weather_api(url, params = params)

# Process first location. Add a for-loop for multiple locations or weather models
response = responses[0]
print(f"Coordinates: {response.Latitude()}°N {response.Longitude()}°E")
print(f"Elevation: {response.Elevation()} m asl")
print(f"Timezone difference to GMT+0: {response.UtcOffsetSeconds()}s")

# Process daily data. The order of variables needs to be the same as requested.
daily = response.Daily()
daily_data = {
    "date": pd.date_range(
        start=pd.to_datetime(daily.Time(), unit="s", utc=True),
        end=pd.to_datetime(daily.TimeEnd(), unit="s", utc=True),
        freq=pd.Timedelta(seconds=daily.Interval()),
        inclusive="left"
    ),
    "relative_humidity_2m_max": daily.Variables(0).ValuesAsNumpy(),
    "wind_direction_10m_dominant": daily.Variables(1).ValuesAsNumpy(),
    "temperature_2m_max": daily.Variables(2).ValuesAsNumpy(),
    "temperature_2m_min": daily.Variables(3).ValuesAsNumpy(),
    "wind_speed_10m_max": daily.Variables(4).ValuesAsNumpy(),
    "wind_gusts_10m_max": daily.Variables(5).ValuesAsNumpy(),
    "precipitation_sum": daily.Variables(6).ValuesAsNumpy(),
}

df = pd.DataFrame(data=daily_data)

# Write to CSV
if os.path.exists(file):
    df.to_csv(file, index=False, mode='a', header=False)
else:
    df.to_csv(file, index=False)  # first run — write with header
print("Saved to weather.csv")
print(df)
