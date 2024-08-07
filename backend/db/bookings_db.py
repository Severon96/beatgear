import uuid
from datetime import datetime
from typing import Sequence, Type
from uuid import UUID

import dateutil.parser
from chalice import NotFoundError
from sqlalchemy import select

from models.models import Booking
from util import util


def get_booking(booking_id: UUID) -> Type[Booking]:
    session = util.get_db_session()

    booking = session.get(Booking, booking_id)

    if booking is None:
        raise NotFoundError(f"Booking with id {booking_id} not found")

    return booking


def get_all_bookings() -> Sequence[Booking]:
    session = util.get_db_session()

    stmt = select(Booking)
    return session.scalars(stmt).all()


def create_booking(booking: Booking) -> Booking:
    now = datetime.now()

    booking.id = uuid.uuid4()
    booking.customer_id = UUID(booking.customer_id) if isinstance(booking.customer_id, str) else booking.customer_id
    booking.hardware_id = UUID(booking.hardware_id) if isinstance(booking.hardware_id, str) else booking.hardware_id
    booking.booking_start = dateutil.parser.isoparse(booking.booking_start) if isinstance(
        booking.booking_start, str) else booking.booking_start
    booking.booking_end = dateutil.parser.isoparse(booking.booking_end) if isinstance(
        booking.booking_end, str) else booking.booking_end
    booking.created_at = now
    booking.updated_at = now

    session = util.get_db_session()

    session.add(booking)
    session.commit()

    return booking


def update_booking(booking_id: UUID, booking: Booking) -> Type[Booking] | None:
    now = datetime.now()

    session = util.get_db_session()

    db_booking = session.get(Booking, booking_id)

    if db_booking is None:
        raise NotFoundError(f"Booking with id {booking_id} not found.")

    # field types might not be appropriate
    booking.id = UUID(booking.id) if isinstance(booking.id, str) else booking.id
    booking.customer_id = UUID(booking.customer_id) if isinstance(booking.customer_id, str) else booking.customer_id
    booking.hardware_id = UUID(booking.hardware_id) if isinstance(booking.hardware_id, str) else booking.hardware_id
    booking.booking_start = dateutil.parser.isoparse(booking.booking_start) if isinstance(
        booking.booking_start, str) else booking.booking_start
    booking.booking_end = dateutil.parser.isoparse(booking.booking_end) if isinstance(
        booking.booking_end, str) else booking.booking_end
    booking.updated_at = now
    booking.created_at = db_booking.created_at

    session.merge(booking)

    session.commit()
    session.refresh(db_booking)

    return db_booking
