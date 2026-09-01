"""
Global exception handlers.
All handlers log the error and return appropriate JSON responses.
"""

import logging
from fastapi import FastAPI, Request
from fastapi.exception_handlers import (
    http_exception_handler,
    request_validation_exception_handler,
)
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.errors.app_error import AppError

logger = logging.getLogger(__name__)


async def custom_http_exception_handler(request: Request, exc: StarletteHTTPException):
    """
    Handles HTTP exceptions raised by route handler.

    Args:
        request: The incoming HTTP request.
        exc: The HTTP exception containing status code and detail.

    Returns: 
        JSONResponse with error details and appropriate HTTP status code.
    """
    logger.warning("HTTP exception: %s %s -> %s", request.method, request.url, exc.detail)
    return await http_exception_handler(request, exc)


async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """
    Handles Pydantic validation errors.
    
    Args:
        request: The incoming HTTP request.
        exc: The validation error containing field-level errors.
    
    Returns:
        JSONResponse with validation error details.
    """
    fields = [".".join(str(p) for p in e["loc"]) for e in exc.errors()]
    logger.warning("Validation error: %s %s -> %s", request.method, request.url, fields)
    return await request_validation_exception_handler(request, exc)


async def unhandled_exception_handler(request: Request, exc: Exception):
    """
    Catches all unhandled exceptions.

    Args:
        request: The incoming HTTP request.
        exc: Any unhandled exception.
    
    Returns:
        JSONResponse with generic 500 error.
    """
    logger.exception("Unhandled error on %s %s", request.method, request.url)
    return JSONResponse(status_code=500, content={"detail": "Internal server error"})


async def app_error_handler(request: Request, exc: AppError):
    """Handle AppError and its subclasses, logging and returning a JSON response.

    Logs at WARNING level for client errors (status_code < 500) and ERROR
    level for server errors. 

    Args:
        request: The incoming HTTP request.
        exc: The AppError instance.

    Returns:
        JSONResponse with status code and detail`.
    """
    log = logger.warning if exc.status_code < 500 else logger.error
    log("%s: %s (%s %s)", type(exc).__name__, exc.detail, request.method, request.url)
    return JSONResponse(status_code=exc.status_code, content={"detail": exc.detail})


def register_exception_handlers(app: FastAPI) -> None:
    """
    Registers all handlers with a FastAPI app instance.

    Args:
        app (FastAPI): The FastAPI application instance.    
    """
    app.add_exception_handler(StarletteHTTPException, custom_http_exception_handler)
    app.add_exception_handler(RequestValidationError, validation_exception_handler)
    app.add_exception_handler(Exception, unhandled_exception_handler)
    app.add_exception_handler(AppError, app_error_handler)