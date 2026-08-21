"""
Shared FastAPI dependencies.

Single source of truth for routers to import `Annotated[..., Depends(...)]` type aliases.
"""

from fastapi import Depends
from typing import Annotated
from sqlmodel import Session
from uuid import UUID

from app.db import get_session
from app.core.auth import get_current_user_id


SessionDep = Annotated[Session, Depends(get_session)]
CurrentUserDep = Annotated[UUID, Depends(get_current_user_id)]