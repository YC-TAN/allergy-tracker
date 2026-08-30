from fastapi import Header, HTTPException
import jwt
from jwt import PyJWKClient
from uuid import UUID
from backend.app.core.config import get_settings
from functools import lru_cache

@lru_cache
def get_jwks_client():
    settings = get_settings()
    return PyJWKClient(settings.supabase_jwks_url)

def get_current_user_id(authorization: str = Header(...)) -> UUID:
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing bearer token")
    token = authorization.removeprefix("Bearer ")
    try:
        signing_key = get_jwks_client().get_signing_key_from_jwt(token)
        payload = jwt.decode(
            token,
            signing_key,
            algorithms=["ES256"],
            audience="authenticated",
        )
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    return UUID(payload["sub"]) # sub is subject, the unique ID of the user represented by the token.