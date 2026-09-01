from .app_error import AppError

class PollenFetchError(AppError):
    """MetService request failed (network error, non-200, timeout)."""
    status_code = 502
    detail = "Could not reach pollen data source"

    def __init__(self, location: str):
        self.location = location
        super().__init__(f"Pollen data unavailable for {location}")


class PollenParseError(AppError):
    """MetService responded, but the HTML/JSON shape didn't match what
    the scraper expects — e.g. they changed their page structure."""
    status_code = 502
    detail = "Could not parse pollen data source response"

    def __init__(self, location: str):
        self.location = location
        super().__init__(f"Failed to parse pollen data for {location}")


class LocationNotSupportedError(AppError):
    """User's location isn't one MetService/your scraper covers."""
    status_code = 400
    detail = "Location not supported"

    def __init__(self, location: str):
        self.location = location
        super().__init__(f"'{location}' is not a supported location")


class PollenDataStaleError(AppError):
    """Cache exists but is older than acceptable (e.g. scheduled job
    didn't run) and a live fetch also failed — surfaced instead of
    silently serving old data."""
    status_code = 503
    detail = "Pollen data is stale and could not be refreshed"