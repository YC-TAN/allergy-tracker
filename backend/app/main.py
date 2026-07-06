from fastapi import FastAPI, Depends, HTTPException
from supabase import Client
from app.db import get_supabase

app = FastAPI()

def main():
    print("Hello from backend!")

@app.get("/")
def read_root():
    return {"message": "Hello from backend"}

@app.get("/health/db")
async def db_health(db: Client = Depends(get_supabase)):
    try:
        db.table("users").select("id").limit(1).execute()
        return {"status": "ok"}
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"Supabase unreachable: {e}")


if __name__ == "__main__":
    main()
