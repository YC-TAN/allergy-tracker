from fastapi import Header, HTTPException
import jwt
from jwt import PyJWKClient
from uuid import UUID
from functools import lru_cache
from .config import get_settings


from app.errors.app_error import (
    InvalidTokenError,
    InvalidSubjectError, 
    MissingTokenError
)


settings = get_settings()


@lru_cache
def get_jwks_client():
    """Return a process-wide singleton PyJWKClient for Supabase's JWKS endpoint.

    lru_cache allows the signing keys be served from memory between fetches,
    returns the same PyJWKClient instance while it is still valid, 
    only hit the JWKS endpoint when the key is missing or unrecognised. 

    PyJWKClient maintains its own internal cache of fetched signing keys with 
    default lifespan 300 seconds.
    """
    return PyJWKClient(settings.supabase_jwks_url)


def get_current_user_id(authorization: str = Header(...)) -> UUID:
    if not authorization.startswith("Bearer "):
        raise MissingTokenError()
    
    token = authorization.removeprefix("Bearer ")
    try:
        signing_key = get_jwks_client().get_signing_key_from_jwt(token)
        payload = jwt.decode(
            token,
            signing_key.key,
            algorithms=["ES256"],
            audience="authenticated",
            issuer=str(settings.supabase_issuer)
        )
    except jwt.PyJWTError:
        raise InvalidTokenError()
    
    try:
        return UUID(payload["sub"]) # sub is subject, the unique ID of the user represented by the token.
    except (KeyError, ValueError):
        raise InvalidSubjectError()