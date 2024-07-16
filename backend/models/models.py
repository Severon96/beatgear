import enum
from datetime import datetime
from typing import Optional, List
from uuid import UUID

from sqlalchemy import Uuid, String, DATETIME, LargeBinary, Enum, ForeignKey
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship


class Base(DeclarativeBase):
    pass


class HardwareCategory(enum.Enum):
    CONTROLLER = 'controller'
    LIGHT = 'light'
    CABLE_XLR = 'cable_xlr'
    PLUG_COLD_APPLIANCE = 'plug_cold_appliance'
    LAPTOP_STAND = 'laptop_stand'
    OTHER = 'other'


class User(Base):
    __tablename__ = "users"

    id: Mapped[UUID] = mapped_column(Uuid, primary_key=True)
    username: Mapped[str] = mapped_column(String(30))
    first_name: Mapped[Optional[str]] = mapped_column(String(30))
    last_name: Mapped[Optional[str]] = mapped_column(String(30))
    created_at: Mapped[datetime] = mapped_column(DATETIME, default=datetime.now())
    updated_at: Mapped[datetime] = mapped_column(DATETIME, default=datetime.now())

    hardware: Mapped[List["Hardware"]] = relationship(
        back_populates="owner", cascade="all, delete-orphan"
    )

    def __repr__(self):
        return (f"User(id={self.id}, username={self.username}, first_name={self.first_name}, last_name={self.last_name}"
                f", created_at={self.created_at}, updated_at={self.updated_at})")


class Hardware(Base):
    __tablename__ = "hardware"

    id: Mapped[UUID] = mapped_column(Uuid, primary_key=True)
    name: Mapped[str] = mapped_column(String(30))
    serial: Mapped[str] = mapped_column(String(30))
    image: Mapped[Optional[bytes]] = mapped_column(LargeBinary)
    category: Mapped[HardwareCategory] = mapped_column(Enum(HardwareCategory))
    owner_id: Mapped[UUID] = mapped_column(ForeignKey("user.id"))
    created_at: Mapped[datetime] = mapped_column(DATETIME, default=datetime.now())
    updated_at: Mapped[datetime] = mapped_column(DATETIME, default=datetime.now())

    owner: Mapped["User"] = relationship(back_populates="hardware")

    def __repr__(self):
        return (f"Hardware(id={self.id}, name={self.name}, serial={self.serial}, image={self.image}, "
                f"category={self.category}, owner_id={self.owner_id}, created_at={self.created_at}, "
                f"updated_at={self.updated_at})")


class Booking(Base):
    __tablename__ = "bookings"

    id: Mapped[UUID] = mapped_column(Uuid, primary_key=True)
    name: Mapped[Optional[str]] = mapped_column(String(30))
    customer_id: Mapped[UUID] = mapped_column(ForeignKey("user.id"))
    hardware_id: Mapped[UUID] = mapped_column(ForeignKey("hardware.id"))
    booking_start: Mapped[datetime] = mapped_column(DATETIME)
    booking_end: Mapped[datetime] = mapped_column(DATETIME)
    created_at: Mapped[datetime] = mapped_column(DATETIME, default=datetime.now())
    updated_at: Mapped[datetime] = mapped_column(DATETIME, default=datetime.now())

    def __repr__(self):
        return (f"Booking(id={self.id}, name={self.name}, customer_id={self.customer_id}, "
                f"hardware_id={self.hardware_id}, booking_start={self.booking_start}, booking_end={self.booking_end}, "
                f"created_at={self.created_at}, updated_at={self.updated_at})")
