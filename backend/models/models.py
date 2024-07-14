from datetime import datetime
from enum import Enum
from uuid import UUID

from pydantic import BaseModel


class HardwareCategory(Enum):
    CONTROLLER = 'controller'
    LIGHT = 'light'
    CABLE_XLR = 'cable_xlr'
    PLUG_COLD_APPLIANCE = 'plug_cold_appliance'
    LAPTOP_STAND = 'laptop_stand'
    OTHER = 'other'


class User(BaseModel):
    id: UUID
    username: str
    first_name: str
    last_name: str
    created_at: datetime
    updated_at: datetime


class Hardware(BaseModel):
    id: UUID
    name: str
    serial: str
    image: bytes
    category: HardwareCategory
    owner_id: UUID
    created_at: datetime
    updated_at: datetime


class Booking(BaseModel):
    id: UUID
    customer_id: UUID
    hardware_id: UUID
    booking_start: datetime
    booking_end: datetime
    created_at: datetime
    updated_at: datetime
