"""
06/Jul/26 
Removed Path definition for `.env`.
Path should only be used for system variable, not configuration, doing so poses security risk.
Pydantic automatically handle reading and parsing of `.env`.
"""


from functools import lru_cache
from pydantic import AnyHttpUrl
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Literal

class Settings(BaseSettings):

    # Supabase
    # supabase_url: AnyHttpUrl
    # supabase_key: SecretStr 
    # database_url: PostgresDsn
    pooler_database_url: str
    supabase_jwt_secret: str
    supabase_jwks_url: str

    # Metservice API
    metservice_base_url: AnyHttpUrl = "https://www.metservice.com"


    # App
    environment: Literal["development", "staging", "production"] = "development"
    debug: bool = False

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore"
    )


@lru_cache
def get_settings() -> Settings:
    """Using @lru_cache to ensure Settings is only constructed exactly once - single, immutable source of truth. 
    Any validation errors surface immediately on first use.    
    """
    return Settings()