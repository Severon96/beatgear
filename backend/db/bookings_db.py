import uuid
from datetime import datetime
from typing import Sequence, Type
from uuid import UUID

from chalice import NotFoundError, BadRequestError
from sqlalchemy import select, insert

from models.models import Booking
from util.util import get_db_connection, get_db_session


def get_booking(booking_id: UUID) -> Type[Booking]:
    session = get_db_session()

    booking = session.get(Booking, booking_id)

    if booking is None:
        raise NotFoundError(f"Booking with id {booking_id} not found")

    return booking


def get_all_bookings() -> Sequence[Booking]:
    session = get_db_session()

    stmt = select(Booking)
    rows = session.exec(stmt)

    return rows.all()


def create_booking(booking: Booking) -> Booking:
    now = datetime.now()

    booking.id = uuid.uuid4()
    booking.created_at = now
    booking.updated_at = now

    booking.model_validate()

    session = get_db_session()

    session.add(booking)
    session.commit()

    return booking
