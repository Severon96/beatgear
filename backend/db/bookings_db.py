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
    connection = get_db_connection()

    statement = insert(Booking).values(
        id=uuid.uuid4(),
        name=booking.name,
        customer_id=booking.customer_id,
        hardware_id=booking.hardware_id,
        booking_start=booking.booking_start,
        booking_end=booking.booking_end,
        created_at=datetime.now(),
        updated_at=datetime.now()
    ).returning(Booking.id)
    statement.compile()

    rows = connection.execute(statement)

    inserted_row_id = rows.first()
    print(inserted_row_id)
    if inserted_row_id is None:
        raise BadRequestError("Error inserting new booking")

    return None
