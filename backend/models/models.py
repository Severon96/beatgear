import enum
from datetime import datetime
from typing import List
from uuid import UUID

from sqlalchemy.orm import Mapped, relationship
from sqlmodel import SQLModel, Field, Relationship


class HardwareCategory(enum.Enum):
    CONTROLLER = 'controller'
    LIGHT = 'light'
    CABLE_XLR = 'cable_xlr'
    PLUG_COLD_APPLIANCE = 'plug_cold_appliance'
    LAPTOP_STAND = 'laptop_stand'
    OTHER = 'other'


class User(SQLModel, table=True):
    __tablename__ = "users"

    id: UUID | None = Field(default=None, primary_key=True)
    username: str
    first_name: str | None = None
    last_name: str | None = None
    created_at: datetime | None = None
    updated_at: datetime | None = None

    hardware: list["Hardware"] = Relationship(
        back_populates="owner"
    )

    def __repr__(self):
        return (f"User(id={self.id}, username={self.username}, first_name={self.first_name}, last_name={self.last_name}"
                f", created_at={self.created_at}, updated_at={self.updated_at})")


class Hardware(SQLModel, table=True):
    __tablename__ = "hardware"

    id: UUID | None = Field(default=None, primary_key=True)
    name: str
    serial: str
    image: str | None = None
    category: HardwareCategory
    owner_id: UUID = Field(default=None, foreign_key="users.id")
    created_at: datetime | None = None
    updated_at: datetime | None = None

    owner: User = Relationship(back_populates="hardware")

    def __repr__(self):
        return (f"Hardware(id={self.id}, name={self.name}, serial={self.serial}, image={self.image}, "
                f"category={self.category}, owner_id={self.owner_id}, created_at={self.created_at}, "
                f"updated_at={self.updated_at})")


class Booking(SQLModel, table=True):
    __tablename__ = "bookings"

    id: UUID | None = Field(default=None, primary_key=True)
    name: str | None = None
    customer_id: UUID = Field(default=None, foreign_key="users.id")
    hardware_id: UUID = Field(default=None, foreign_key="hardware.id")
    booking_start: datetime
    booking_end: datetime
    created_at: datetime
    updated_at: datetime

    def __repr__(self):
        return (f"Booking(id={self.id}, name={self.name}, customer_id={self.customer_id}, "
                f"hardware_id={self.hardware_id}, booking_start={self.booking_start}, booking_end={self.booking_end}, "
                f"created_at={self.created_at}, updated_at={self.updated_at})")
