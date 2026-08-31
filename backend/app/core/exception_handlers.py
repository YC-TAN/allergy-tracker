import logging
from fastapi import FastAPI, Request
from fastapi.exception_handlers import (
    http_exception_handler,
    request_validation_exception_handler,
)
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException

logger = logging.getLogger(__name__)


async def custom_http_exception_handler(request: Request, exc: StarletteHTTPException):
    logger.warning("HTTP exception: %s %s -> %s", request.method, request.url, exc.detail)
    return await http_exception_handler(request, exc)


async def validation_exception_handler(request: Request, exc: RequestValidationError):
    fields = [".".join(str(p) for p in e["loc"]) for e in exc.errors()]
    logger.warning("Validation error: %s %s -> %s", request.method, request.url, fields)
    return await request_validation_exception_handler(request, exc)


async def unhandled_exception_handler(request: Request, exc: Exception):
    logger.exception("Unhandled error on %s %s", request.method, request.url)
    return JSONResponse(status_code=500, content={"detail": "Internal server error"})


def register_exception_handlers(app: FastAPI) -> None:
    app.add_exception_handler(StarletteHTTPException, custom_http_exception_handler)
    app.add_exception_handler(RequestValidationError, validation_exception_handler)
    app.add_exception_handler(Exception, unhandled_exception_handler)