"""
09/Jul/2026 Not using supabase-py as the generated python types TypedDict is not stable yet
ref: https://github.com/supabase/supabase-py/issues/1443 

SQLModel.metadata.create_all(engine) is not required here as the db is created via supabase CLI

"""

from sqlmodel import create_engine, Session
from app.config import get_settings

settings = get_settings()
database_url = settings.pooler_database_url
echo: bool = settings.environment == 'development' 
engine = create_engine(database_url, pool_size=5, max_overflow=5, echo = echo)

def get_session():
    with Session(engine) as session:
        yield session

# from functools import lru_cache
# from supabase import create_client, Client

# from app.config import get_settings 

# @lru_cache
# def get_supabase() -> Client:
#     """
#     Instantiate Supabase Client exactly once using @lru_cache, 
#     to be used as dependency so it is swappable in tests.
   
#     Caching and reusing the same instance allows the underlying libraries maintain open connections to Supabase's servers, 
#     ensuring the app is talking to the same client instance with same shared state and configuration.
    
#     Secret key bypass the RLS, which is designed for server process.
#     """
#     settings = get_settings()
#     url = str(settings.supabase_url)
#     key = settings.supabase_key.get_secret_value()
#     return create_client(url, key)
