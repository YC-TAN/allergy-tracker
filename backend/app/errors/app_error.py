class AppError(Exception):
    """Base exception for all custom application errors.

    Attributes:
        status_code (int): HTTP status code associated with the error.
        detail (str): Human-readable error message.
    """

    status_code = 500
    detail = "Internal server error"

    def __init__(self, detail: str | None = None):
        """Initialize the exception with an optional detail message.

        Args:
            detail (str | None): Custom error detail. If not provided, the
                class-level default detail is used.
        """
        self.detail = detail or self.detail
        super().__init__(self.detail)


class NotFoundError(AppError):
    """Base exception raised when a requested resource cannot be found.

    Attributes:
        status_code (int): HTTP 404 status code.
        detail (str): Default message for missing resources.
    """

    status_code = 404
    detail = "Resource not found"

    def __init__(self, resource: str = "Resource"):
        """Initialize a not-found error for a specific resource.

        Args:
            resource (str): Name of the missing resource.
        """
        super().__init__(f"{resource} not found")


class EntryNotFoundError(NotFoundError):
    """Raised when no entry exists for the requested user or date."""

    def __init__(self):
        """Initialize the entry-not-found error."""
        super().__init__("Entry")


class UnsupportedLocationError(AppError):
    status_code = 400
    detail = "Unsupported location"

    def __init__(self, location: str):
        super().__init__(f"Location '{location}' is not supported")


class PollenFetchError(AppError):
    status_code = 502  # Bad Gateway — upstream (MetService) failed
    detail = "Unable to fetch pollen data"

    def __init__(self, location: str):
        super().__init__(f"Unable to fetch pollen data from '{location}'")