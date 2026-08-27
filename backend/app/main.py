from fastapi import FastAPI, APIRouter
from .routers import pollen_forecast, internal, entry
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

api = APIRouter(prefix="/api")
api.include_router(pollen_forecast.router)
api.include_router(internal.router)
api.include_router(entry.router)
app.include_router(api)
app.frontend("/", directory="dist", fallback="index.html")

origins = [
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def main():
    print("Hello from backend!")

@app.get("/")
def read_root():
    return {"message": "Hello from backend"}

if __name__ == "__main__":
    main()
