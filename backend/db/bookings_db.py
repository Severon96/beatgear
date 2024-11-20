from datetime import datetime, timezone
from http import HTTPStatus
from typing import Sequence, Type, Any
from uuid import UUID

import dateutil.parser
from flask import abort, make_response, jsonify
from sqlalchemy import select, Row, RowMapping

from models.db_models import BookingDb
from util import util


def get_booking(booking_id: UUID) -> Type[BookingDb]:
    session = util.get_db_session()

    booking = session.get(BookingDb, booking_id)

    if booking is None:
        abort(
            make_response(
                jsonify(message=f"Booking with id {booking_id} not found"),
                HTTPStatus.NOT_FOUND,
            )
        )

    return booking


def get_all_bookings() -> Sequence[BookingDb]:
    session = util.get_db_session()

    stmt = select(BookingDb)
    bookings = session.scalars(stmt).all()

    return bookings


def get_current_bookings_for_user(
    user_id: UUID,
) -> Sequence[Row[Any] | RowMapping | Any]:
    session = util.get_db_session()
    now = datetime.now()

    stmt = session.query(BookingDb).filter(
        BookingDb.booking_end >= now, BookingDb.customer_id == user_id
    )

    return session.scalars(stmt).all()


def create_booking(booking: BookingDb) -> BookingDb:
    _prepare_for_creation(booking)

    session = util.get_db_session()

    session.add(booking)
    session.commit()

    return booking


def get_current_booking_inquiries_for_user(
    user_id: UUID,
) -> Sequence[Row[Any] | RowMapping | Any]:
    session = util.get_db_session()
    now = datetime.now()

    stmt = session.query(BookingInquiryDb).filter(
        BookingInquiryDb.booking_end >= now, BookingInquiryDb.customer_id == user_id
    )

    return session.scalars(stmt).all()


def update_booking(booking_id: UUID, booking: BookingDb) -> Type[BookingDb]:
    session = util.get_db_session()

    db_booking = session.get(BookingDb, booking_id)

    if db_booking is None:
        abort(
            make_response(
                jsonify(message=f"Booking with id {booking_id} not found"),
                HTTPStatus.NOT_FOUND,
            )
        )

    # field types might not be appropriate
    booking.id = UUID(booking.id) if isinstance(booking.id, str) else booking.id
    booking.customer_id = (
        UUID(booking.customer_id)
        if isinstance(booking.customer_id, str)
        else booking.customer_id
    )
    booking.booking_start = (
        dateutil.parser.isoparse(booking.booking_start)
        if isinstance(booking.booking_start, str)
        else booking.booking_start
    )
    booking.booking_end = (
        dateutil.parser.isoparse(booking.booking_end)
        if isinstance(booking.booking_end, str)
        else booking.booking_end
    )

    session.merge(booking)

    session.commit()
    session.refresh(db_booking)

    return db_booking


def create_multiple_bookings(
    bookings: list[BookingDb],
) -> list[BookingDb]:
    bookings = [_prepare_for_creation(booking_inquiry) for booking_inquiry in bookings]

    session = util.get_db_session()

    session.bulk_save_objects(bookings)
    session.commit()

    return bookings


def _prepare_for_creation(entity: BookingDb) -> BookingDb:
    entity.customer_id = (
        UUID(entity.customer_id)
        if isinstance(entity.customer_id, str)
        else entity.customer_id
    )
    entity.booking_start = (
        dateutil.parser.isoparse(entity.booking_start)
        if isinstance(entity.booking_start, str)
        else entity.booking_start
    )
    entity.booking_end = (
        dateutil.parser.isoparse(entity.booking_end)
        if isinstance(entity.booking_end, str)
        else entity.booking_end
    )
    entity.created_at = datetime.now(tz=timezone.utc)
    entity.updated_at = datetime.now(tz=timezone.utc)

    return entity
