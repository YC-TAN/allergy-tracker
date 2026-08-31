from fastapi import FastAPI, APIRouter, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import logging

from .routers import pollen_forecast, internal, entry
from .core.logging_config import setup_logging
from .core.exception_handlers import register_exception_handlers

setup_logging()
logger = logging.getLogger(__name__)

app = FastAPI()
register_exception_handlers(app)

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

@app.get("/health-check")
def read_root():
    return {"message": "Hello from backend"}


if __name__ == "__main__":
    main()
