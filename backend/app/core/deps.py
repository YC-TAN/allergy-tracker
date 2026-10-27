"""
Shared FastAPI dependencies.

Single source of truth for routers to import `Annotated[..., Depends(...)]` type aliases.
"""

from typing import Annotated
from uuid import UUID

from fastapi import Depends
from sqlmodel import Session

from .auth import get_current_user_id
from .db import get_session

SessionDep = Annotated[Session, Depends(get_session)]
CurrentUserDep = Annotated[UUID, Depends(get_current_user_id)]