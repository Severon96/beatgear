import uuid
from datetime import datetime

from db import users_db, bookings_db, hardware_db
from models.models import User, Booking, Hardware, HardwareCategory


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

    return Hardware(
        id=uuid.uuid4(),
        name='test hardware',
        serial=f'hdw-{uuid.uuid4()}',
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
) -> Booking:
    if customer_id is None:
        user = create_user()
        customer_id = user.id

    return Booking(
        id=uuid.uuid4(),
        name='test booking',
        customer_id=customer_id,
        booking_start=datetime.now(),
        booking_end=datetime.now(),
        created_at=datetime.now(),
        updated_at=datetime.now()
    )


def create_booking(booking: Booking) -> Booking:
    if booking is None:
        booking = setup_booking()

    return bookings_db.create_booking(booking)
