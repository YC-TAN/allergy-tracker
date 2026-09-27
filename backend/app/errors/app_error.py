class AppError(Exception):
    """Base exception for all custom application errors.

    Attributes:
        status_code (int): HTTP 500 status code.
        detail (str): Error message.
        headers (dict[str, str] | None): Optional response headers.
    """

    status_code = 500
    detail = "Internal server error"
    headers: dict[str, str] | None = None

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
    """Raised when a requested location is not supported.

    Attributes:
        status_code (int): HTTP 400 status code.
        detail (str): Default message for unsupported locations.
    """

    status_code = 400
    detail = "Unsupported location"

    def __init__(self, location: str):
        """Initialize an unsupported-location error.

        Args:
            location (str): Name of the unsupported location.
        """
        super().__init__(f"Location '{location}' is not supported")


class PollenFetchError(AppError):
    """Raised when pollen data cannot be fetched from the upstream service.

    Attributes:
        status_code (int): HTTP 502 status code.
        detail (str): Default message for pollen-fetch failures.
    """

    status_code = 502  # Bad Gateway — upstream (MetService) failed
    detail = "Unable to fetch pollen data"

    def __init__(self, location: str):
        """Initialize a pollen-fetch error.

        Args:
            location (str): Location for which pollen data could not be fetched.
        """
        super().__init__(f"Unable to fetch pollen data from '{location}'")


class AuthError(AppError):
    """Base exception for authentication failures.

    Attributes:
        status_code (int): HTTP 401 status code.
        detail (str): Default message for authentication failures.
        headers (dict[str, str]): Response headers for the authentication error.
    """

    status_code = 401
    detail = "Authentication failed"

    def __init__(self, detail: str | None = None, *, headers: dict[str, str] | None = None):
        """Initialize an authentication error.

        Args:
            detail (str | None): Custom authentication error detail.
            headers (dict[str, str] | None): Optional response headers.
        """
        super().__init__(detail)
        self.headers = headers or {"WWW-Authenticate": "Bearer"}


class MissingTokenError(AuthError):
    """Raised when the Authorization header is missing or malformed."""

    def __init__(self):
        super().__init__("Missing bearer token")


class InvalidTokenError(AuthError):
    """Raised when the JWT fails signature, expiry, audience, or issuer checks
        this token isn't legitimately from Supabase.
    """

    def __init__(self):
        super().__init__("Invalid or expired token")


class InvalidSubjectError(AuthError):
    """Raised when the token's `sub` claim is missing or not a valid UUID but
       the token is legitimately signed by Supabase.
    """

    def __init__(self):
        super().__init__("Token missing a valid subject")