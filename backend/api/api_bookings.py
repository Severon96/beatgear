from http import HTTPStatus
from uuid import UUID

from chalice import Blueprint, Response, BadRequestError
from pydantic_core import ValidationError

from api.constants import cors_config
from db import bookings_db
from models.models import Booking
from util.util import parse_model

api = Blueprint(__name__)


@api.route("/bookings", methods=['GET'], cors=cors_config)
def get_all_bookings():
    bookings = bookings_db.get_all_bookings()
    body = [booking.model_dump(mode='json') for booking in bookings]

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
        body=booking.model_dump_json()
    )


@api.route("/bookings", methods=['POST'], cors=cors_config)
def create_booking():
    request = api.current_request
    try:
        booking: Booking = parse_model(Booking, request.json_body)
    except ValidationError as e:
        raise BadRequestError(str(e))

    bookings_db.create_booking(booking)

    return Response(
        status_code=HTTPStatus.OK,
        body=booking.model_dump_json()
    )
