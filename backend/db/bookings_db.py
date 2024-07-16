import uuid
from datetime import datetime
from uuid import UUID

from chalice import NotFoundError, BadRequestError
from sqlalchemy import select, insert

from models.models import Booking
from util.util import get_db_connection


def get_booking(booking_id: UUID) -> Booking:
    connection = get_db_connection()

    statement = select(Booking).where(Booking.name == booking_id)
    rows = connection.execute(statement).scalars()

    if rows.first() is None:
        raise NotFoundError(f"booking not found for id {booking_id}")

    return rows.first()


def get_all_bookings() -> list[Booking]:
    connection = get_db_connection()

    statement = select(Booking)
    rows = connection.execute(statement).scalars()

    return [row for row in rows]


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
