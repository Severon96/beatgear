from uuid import UUID

from chalice import NotFoundError
from sqlalchemy import select

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
    connection, cursor = get_db_connection()

    cursor.execute("SELECT * FROM bookings;")
    values = cursor.fetchall()

    close_db_connection(connection, cursor)

    return parse_model_list(Booking, values)


def create_booking(booking: Booking) -> Booking:
    connection, cursor = get_db_connection()

    cursor.execute(
        "INSERT INTO bookings(id, title, room_id, start_time, end_time, recurring) VALUES (%s, %s, %s, %s, %s, %s)",
        (str(booking.id), booking.title, str(booking.room_id), booking.start_time, booking.end_time,
         booking.recurring))
    connection.commit()

    close_db_connection(connection, cursor)

    return booking
