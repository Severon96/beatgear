import enum
import json
from datetime import datetime
from typing import Optional, List, Any
from uuid import UUID

from sqlalchemy import Uuid, String, LargeBinary, Enum, ForeignKey, Table, Column, DateTime, Float
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship, validates


class JSONEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, UUID):
            # if the obj is uuid, we simply return the value of uuid
            return obj.hex
        if isinstance(obj, datetime):
            return obj.isoformat()
        if isinstance(obj, HardwareCategory):
            return obj.name
        return json.JSONEncoder.default(self, obj)


class Base(DeclarativeBase):
    def json(self) -> str:
        return json.dumps(self.dict(), cls=JSONEncoder)

    def dict(self) -> dict[Any, Any]:
        return {col.name: getattr(self, col.name) for col in self.__table__.columns}

    pass


class HardwareCategory(enum.Enum):
    CONTROLLER = 'CONTROLLER'
    LIGHT = 'LIGHT'
    CABLE_XLR = 'CABLE_XLR'
    PLUG_COLD_APPLIANCE = 'PLUG_COLD_APPLIANCE'
    LAPTOP_STAND = 'LAPTOP_STAND'
    OTHER = 'OTHER'


booking_to_hardware_table = Table(
    "bookings_to_hardware",
    Base.metadata,
    Column("booking_id", ForeignKey("bookings.id")),
    Column("hardware_id", ForeignKey("hardware.id")),
)


class HardwareDb(Base):
    __tablename__ = "hardware"

    id: Mapped[UUID] = mapped_column(Uuid, primary_key=True)
    name: Mapped[str] = mapped_column(String(250))
    serial: Mapped[str] = mapped_column(String(50))
    image: Mapped[Optional[str]] = mapped_column(String)
    category: Mapped[HardwareCategory] = mapped_column(Enum(HardwareCategory))
    owner_id: Mapped[UUID] = mapped_column(Uuid)
    price_per_hour: Mapped[float] = mapped_column(Float, default=0)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.now())

    bookings: Mapped[List["BookingDb"]] = relationship(secondary=booking_to_hardware_table, back_populates="hardware")

    @validates("name", "serial", "category", "owner_id", include_removes=True)
    def validates_hardware(self, key, value, is_remove) -> str:
        if is_remove:
            raise ValueError(f"not allowed to remove {key} from user")
        else:
            if value is None:
                raise ValueError(f"{key} must be set")
            return value

    def __repr__(self):
        return (f"Hardware(id={self.id}, name={self.name}, serial={self.serial}, image={self.image}, "
                f"category={self.category}, owner_id={self.owner_id}, created_at={self.created_at}, "
                f"updated_at={self.updated_at})")


class BookingDb(Base):
    __tablename__ = "bookings"

    def __init__(self, **kw: Any):
        super().__init__(**kw)

    id: Mapped[UUID] = mapped_column(Uuid, primary_key=True)
    name: Mapped[Optional[str]] = mapped_column(String(30))
    customer_id: Mapped[UUID] = mapped_column(Uuid)
    booking_start: Mapped[datetime] = mapped_column(DateTime)
    booking_end: Mapped[datetime] = mapped_column(DateTime)
    author_id: Mapped[UUID] = mapped_column(Uuid)
    total_amount: Mapped[float] = mapped_column(Float, default=0)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.now())

    hardware: Mapped[List[HardwareDb]] = relationship(secondary=booking_to_hardware_table)

    def dict(self) -> dict[Any, Any]:
        booking_dict = super().dict()
        booking_dict['hardware'] = [hardware_obj.dict() for hardware_obj in self.hardware]
        return booking_dict

    @validates("customer_id", "hardware_id", "booking_start", "booking_end", include_removes=True)
    def validates_booking(self, key, value, is_remove) -> str:
        if is_remove:
            raise ValueError(f"not allowed to remove {key} from booking")
        else:
            if value is None:
                raise ValueError(f"{key} must be set")
            return value

    def __repr__(self):
        return (f"Booking(id={self.id}, name={self.name}, customer_id={self.customer_id}, "
                f"booking_start={self.booking_start}, booking_end={self.booking_end}, "
                f"created_at={self.created_at}, updated_at={self.updated_at})")
