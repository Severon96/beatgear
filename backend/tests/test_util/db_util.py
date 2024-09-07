import uuid
from datetime import datetime
from typing import List

from db import bookings_db, hardware_db
from models.db_models import Booking, Hardware, HardwareCategory
from models.request_models import BookingRequest
from util.model_util import convert_to_db_booking


def setup_hardware(user_uuid = None) -> Hardware:
    if user_uuid is None:
        user_uuid = uuid.uuid4()

    hardware_id = uuid.uuid4()
    return Hardware(
        id=hardware_id,
        name='test hardware',
        serial=f'hdw-{hardware_id}',
        image=None,
        category=HardwareCategory.CONTROLLER,
        owner_id=user_uuid,
        created_at=datetime.now(),
        updated_at=datetime.now()
    )


def create_hardware(hardware: Hardware = None) -> Hardware:
    if hardware is None:
        hardware = setup_hardware()

    return hardware_db.create_hardware(hardware)


def setup_booking(
        customer_id: uuid.UUID = None,
        hardware_ids: List[uuid.UUID] = None,
        author_id: uuid.UUID = None,
) -> BookingRequest:
    if customer_id is None:
        customer_id = uuid.uuid4()

    if hardware_ids is None:
        hardware_1 = create_hardware()
        hardware_2 = create_hardware()
        hardware_ids = [hardware_1.id, hardware_2.id]

    if author_id is None:
        author_id = uuid.uuid4()

    return BookingRequest(
        id=uuid.uuid4(),
        name='test booking',
        customer_id=customer_id,
        hardware_ids=hardware_ids,
        booking_start=datetime.now(),
        booking_end=datetime.now(),
        author_id=author_id,
    )


def create_booking(booking: BookingRequest) -> Booking:
    if booking is None:
        booking = setup_booking()

    db_booking = convert_to_db_booking(booking)

    return bookings_db.create_booking(db_booking)
