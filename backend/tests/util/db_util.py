import uuid
from datetime import datetime
from typing import List

from db import users_db, bookings_db, hardware_db
from models.db_models import User, Booking, Hardware, HardwareCategory
from models.request_models import BookingRequest


def setup_user() -> User:
    return User(
        id=uuid.uuid4(),
        username='testuser',
        first_name='Test',
        last_name='User',
        created_at=datetime.now(),
        updated_at=datetime.now()
    )


def create_user(user: User = None) -> User:
    if user is None:
        user = setup_user()

    return users_db.create_user(user)


def setup_hardware(user: User = None) -> Hardware:
    if user is None:
        user = create_user()

    hardware_id = uuid.uuid4()
    return Hardware(
        id=hardware_id,
        name='test hardware',
        serial=f'hdw-{hardware_id}',
        image=None,
        category=HardwareCategory.CONTROLLER,
        owner=user,
        owner_id=user.id,
        created_at=datetime.now(),
        updated_at=datetime.now()
    )


def create_hardware(hardware: Hardware = None) -> Hardware:
    if hardware is None:
        hardware = setup_hardware()

    return hardware_db.create_hardware(hardware)


def setup_booking(
        customer_id: uuid.UUID = None,
        hardware_ids: List[uuid.UUID] = None
) -> BookingRequest:
    if customer_id is None:
        user = create_user()
        customer_id = user.id

    if hardware_ids is None:
        hardware_1 = create_hardware()
        hardware_2 = create_hardware()
        hardware_ids = [hardware_1.id, hardware_2.id]

    return BookingRequest(
        id=uuid.uuid4(),
        name='test booking',
        customer_id=customer_id,
        hardware_ids=hardware_ids,
        booking_start=datetime.now(),
        booking_end=datetime.now(),
    )


def create_booking(booking: Booking) -> Booking:
    if booking is None:
        booking = setup_booking()

    return bookings_db.create_booking(booking)
