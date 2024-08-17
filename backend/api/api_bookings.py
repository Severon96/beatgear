from http import HTTPStatus
from uuid import UUID

from chalice import Blueprint, Response, BadRequestError
from pydantic_core import ValidationError

from api.constants import cors_config
from db import bookings_db
from db.hardware_db import get_hardware
from models.db_models import Booking
from models.request_models import BookingRequest
from util.model_util import convert_to_db_booking
from util.util import parse_model

api = Blueprint(__name__)


@api.route("/bookings", methods=['GET'], cors=cors_config)
def get_all_bookings():
    bookings = bookings_db.get_all_bookings()
    body = [booking.json() for booking in bookings]

    return Response(
        status_code=HTTPStatus.OK,
        body=body
    )


@api.route("/bookings/{booking_id}", methods=['GET'], cors=cors_config)
def get_booking(booking_id: str):
    try:
        uuid = UUID(booking_id)
    except ValueError:
        raise BadRequestError(f"{booking_id} is not a valid id")
    booking = bookings_db.get_booking(uuid)

    return Response(
        status_code=HTTPStatus.OK,
        body=booking.json()
    )


@api.route("/bookings", methods=['POST'], cors=cors_config)
def create_booking():
    request = api.current_request
    try:
        json_body = request.json_body
        request_booking = parse_model(BookingRequest, json_body)

        hardware = []
        for hardware_id in request_booking.hardware_ids:
            request_hardware = get_hardware(hardware_id)
            hardware.append(request_hardware)

        db_booking = convert_to_db_booking(request_booking, hardware)
        bookings_db.create_booking(db_booking)

        return Response(
            status_code=HTTPStatus.CREATED,
            headers={'Content-Type': 'application/json'},
            body=request_booking.json()
        )
    except (ValidationError, ValueError) as e:
        raise BadRequestError(str(e))


@api.route("/bookings/{booking_id}", methods=['PATCH'], cors=cors_config)
def update_booking(booking_id: str):
    try:
        booking_uuid = UUID(booking_id)
    except ValueError:
        raise BadRequestError(f"{booking_id} is not a valid id")

    request = api.current_request
    try:
        json_body = request.json_body
        parsed_booking = Booking(**json_body)

        updated_user = bookings_db.update_booking(booking_uuid, parsed_booking)

        return Response(
            status_code=HTTPStatus.OK,
            headers={'Content-Type': 'application/json'},
            body=updated_user.json()
        )
    except (ValidationError, ValueError) as e:
        raise BadRequestError(str(e))
