from fastapi import FastAPI, Depends
from app.config import Settings, get_settings

app = FastAPI()

def main():
    print("Hello from backend!")

@app.get("/health")
async def health(settings: Settings = Depends(get_settings)):
    from supabase import create_client
    client = create_client(
        str(settings.supabase_url),
        settings.supabase_key.get_secret_value()
    )
    # result = client.table("users").select("*").limit(1).execute()
    return {"status": "ok", "url": str(settings.supabase_url)}


if __name__ == "__main__":
    main()
