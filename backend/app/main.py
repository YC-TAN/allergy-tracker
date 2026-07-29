from fastapi import FastAPI
from .routers import pollen_forecast, internal
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.include_router(pollen_forecast.router)
app.include_router(internal.router)

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
