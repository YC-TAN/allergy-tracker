"""
This module includes endpoints that are only called internally.
Users cannot access these endpoints.
"""

from fastapi import APIRouter


router = APIRouter()


@router.get("/health")
def health():
    return {"message": "Hello!"}
