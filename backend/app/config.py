
# import os
# from dotenv import load_dotenv
from functools import lru_cache
from pathlib import Path
from pydantic import AnyHttpUrl, SecretStr
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Literal

ENV_FILE = Path(__file__).parent.parent/".env"

class Settings(BaseSettings):
    # Supabase
    supabase_url: AnyHttpUrl
    supabase_key: SecretStr 

    # App
    environment: Literal["development", "staging", "production"] = "development"
    debug: bool = False

    model_config = SettingsConfigDict(
        env_file="ENV_FILE",
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

# SUPABASE_URL: str = os.getenv("SUPABASE_URL")
# SUPABASE_KEY: str = os.getenv("SUPABASE_KEY")