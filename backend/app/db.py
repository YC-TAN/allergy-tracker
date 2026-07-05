from functools import lru_cache
from supabase import create_client, Client

from app.config import get_settings 

@lru_cache
def get_supabase() -> Client:
    """
    Using @lru_cache to ensure that the client is instantiated only once 
    and the app is talking to the same client instance with same shared state and configuration.
    
    Reusing the same instance allows the underlying libraries maintain open connections to Supabase's servers.
    Using secret key which bypass the RLS by design for server process.
    """
    settings = get_settings()
    return create_client(settings.supabase_url, settings.supabase_key)
