import uuid
from datetime import datetime
from http import HTTPStatus
from typing import Sequence, Type, Any
from uuid import UUID

import dateutil.parser
from flask import abort, make_response, jsonify
from sqlalchemy import select, Row, RowMapping

from models.db_models import BookingDb, BookingInquiryDb
from models.models import Booking
from util import util


def get_booking(booking_id: UUID) -> Type[BookingDb]:
    session = util.get_db_session()

    booking = session.get(BookingDb, booking_id)

    if booking is None:
        abort(make_response(jsonify(message=f"Booking with id {booking_id} not found"), HTTPStatus.NOT_FOUND))

    return booking


def get_all_bookings() -> Sequence[BookingDb]:
    session = util.get_db_session()

    stmt = select(BookingDb)
    bookings = session.scalars(stmt).all()

    return bookings


def get_current_bookings_for_user(user_id: UUID) -> Sequence[Row[Any] | RowMapping | Any]:
    session = util.get_db_session()
    now = datetime.now()

    stmt = session.query(BookingDb).filter(
        BookingDb.booking_end >= now,
        BookingDb.customer_id == user_id)

    return session.scalars(stmt).all()


def create_booking(booking: BookingDb) -> BookingDb:
    now = datetime.now()

    booking.id = uuid.uuid4()
    booking.customer_id = UUID(booking.customer_id) if isinstance(booking.customer_id, str) else booking.customer_id
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


def create_booking_inquiry(booking_inquiry: BookingInquiryDb) -> BookingInquiryDb:
    now = datetime.now()

    booking_inquiry.id = uuid.uuid4()
    booking_inquiry.customer_id = UUID(booking_inquiry.customer_id) if isinstance(booking_inquiry.customer_id, str) else booking_inquiry.customer_id
    booking_inquiry.booking_start = dateutil.parser.isoparse(booking_inquiry.booking_start) if isinstance(
        booking_inquiry.booking_start, str) else booking_inquiry.booking_start
    booking_inquiry.booking_end = dateutil.parser.isoparse(booking_inquiry.booking_end) if isinstance(
        booking_inquiry.booking_end, str) else booking_inquiry.booking_end
    booking_inquiry.created_at = now
    booking_inquiry.updated_at = now

    session = util.get_db_session()

    session.add(booking_inquiry)
    session.commit()

    return booking_inquiry


def update_booking(booking_id: UUID, booking: BookingDb) -> Type[BookingDb]:
    now = datetime.now()

    session = util.get_db_session()

    db_booking = session.get(BookingDb, booking_id)

    if db_booking is None:
        abort(make_response(jsonify(message=f"Booking with id {booking_id} not found"), HTTPStatus.NOT_FOUND))

    # field types might not be appropriate
    booking.id = UUID(booking.id) if isinstance(booking.id, str) else booking.id
    booking.customer_id = UUID(booking.customer_id) if isinstance(booking.customer_id, str) else booking.customer_id
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
