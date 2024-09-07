from datetime import datetime
from typing import List, Optional
from uuid import UUID

from pydantic import BaseModel

from models.db_models import HardwareCategory


class AuthenticatedUser(BaseModel):
    id: UUID
    username: str
    roles: list[str]


class User(BaseModel):
    id: UUID
    username: str
    first_name: Optional[str]
    last_name: Optional[str]


class HardwareRequest(BaseModel):
    id: UUID
    name: str
    serial: str
    image: Optional[bytes]
    category: HardwareCategory
    owner_id: UUID


class BookingRequest(BaseModel):
    id: UUID
    name: str
    customer_id: UUID
    hardware_ids: List[UUID]
    booking_start: datetime
    booking_end: datetime
    author_id: UUID
