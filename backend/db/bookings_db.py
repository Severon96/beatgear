import uuid
from datetime import datetime
from typing import Sequence, Type
from uuid import UUID

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
    rows = session.exec(stmt)

    return rows.all()


def create_booking(booking: Booking) -> Booking:
    now = datetime.now()

    booking.id = uuid.uuid4()
    booking.created_at = now
    booking.updated_at = now

    booking.model_validate()

    session = util.get_db_session()

    session.add(booking)
    session.commit()

    return booking
