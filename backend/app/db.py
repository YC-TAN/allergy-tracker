from functools import lru_cache
from supabase import create_client, Client

from app.config import get_settings 

@lru_cache
def get_supabase() -> Client:
    """
    Instantiate Supabase Client exactly once using @lru_cache, 
    to be used as dependency so it is swappable in tests.
   
    Caching and reusing the same instance allows the underlying libraries maintain open connections to Supabase's servers, 
    ensuring the app is talking to the same client instance with same shared state and configuration.
    
    Secret key bypass the RLS, which is designed for server process.
    """
    settings = get_settings()
    return create_client(settings.supabase_url, settings.supabase_key)
