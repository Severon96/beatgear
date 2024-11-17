import uuid
from http import HTTPStatus

from flask import jsonify, make_response, abort

from db.hardware_db import get_hardware_by_ids
from models.db_models import BookingDb, BookingInquiryDb
from models.models import BookingRequest, BookingInquiryRequest


def convert_to_db_booking_inquiry(booking_inquiry: BookingInquiryRequest) -> BookingInquiryDb:
    hardware = get_hardware_by_ids(booking_inquiry.hardware_ids)

    if len(hardware) == 0:
        abort(make_response(jsonify(message=f"No available hardware provided"), HTTPStatus.BAD_REQUEST))

    return BookingInquiryDb(
        id=uuid.uuid4(),
        customer_id=booking_inquiry.customer_id,
        hardware=hardware,
        booking_start=booking_inquiry.booking_start,
        booking_end=booking_inquiry.booking_end,
        author_id=booking_inquiry.author_id,
        total_amount=booking_inquiry.total_amount,
        total_booking_days=booking_inquiry.total_booking_days
    )


def update_db_booking_inquiry_from_request(booking_inquiry: BookingInquiryRequest, db_booking_inquiry: BookingInquiryDb) -> BookingInquiryDb:
    hardware = get_hardware_by_ids(booking_inquiry.hardware_ids)

    if len(hardware) == 0:
        abort(make_response(jsonify(message=f"No available hardware provided"), HTTPStatus.BAD_REQUEST))

    return BookingInquiryDb(
        id=db_booking_inquiry.id,
        customer_id=booking_inquiry.customer_id,
        hardware=hardware,
        booking_start=booking_inquiry.booking_start,
        booking_end=booking_inquiry.booking_end,
        author_id=booking_inquiry.author_id,
        total_amount=booking_inquiry.total_amount,
        total_booking_days=booking_inquiry.total_booking_days
    )


def convert_to_db_booking(booking_request: BookingRequest) -> BookingDb:
    hardware = get_hardware_by_ids(booking_request.hardware_ids)

    if len(hardware) == 0:
        abort(make_response(jsonify(message=f"No available hardware provided"), HTTPStatus.BAD_REQUEST))

    return BookingDb(
        id=booking_request.id,
        name=booking_request.name,
        customer_id=booking_request.customer_id,
        hardware=hardware,
        booking_start=booking_request.booking_start,
        booking_end=booking_request.booking_end,
        author_id=booking_request.author_id,
        total_amount=0 # needs to be finally set by the rental
    )


def convert_to_booking_request(booking: BookingDb) -> BookingRequest:
    return BookingRequest(
        id=booking.id,
        name=booking.name,
        customer_id=booking.customer_id,
        hardware_ids=[hardware.id for hardware in booking.hardware],
        booking_start=booking.booking_start,
        booking_end=booking.booking_end,
        author_id=booking.author_id,
    )