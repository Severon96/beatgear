from datetime import datetime
from typing import Optional, List
from uuid import UUID

from pydantic import BaseModel

from models.db_models import HardwareCategory


class AuthenticatedUser(BaseModel):
    id: UUID
    username: str
    roles: list[str]


class HardwareBase(BaseModel):
    id: UUID
    name: str
    serial: str
    image: Optional[bytes]
    category: HardwareCategory
    owner_id: UUID
    price_per_hour: float = 0.00

    class Config:
        use_enum_values = True


class Hardware(HardwareBase):
    bookings: list['Booking'] = []

    class Config:
        use_enum_values = True


class BookingRequest(BaseModel):
    id: UUID
    name: str
    customer_id: UUID
    hardware_ids: List[UUID]
    booking_start: datetime
    booking_end: datetime
    author_id: UUID


class Booking(BaseModel):
    id: UUID
    name: str
    customer_id: UUID
    booking_start: datetime
    booking_end: datetime
    author_id: UUID
    total_amount: float = 0
    created_at: datetime
    updated_at: datetime
    hardware: list[Hardware]
