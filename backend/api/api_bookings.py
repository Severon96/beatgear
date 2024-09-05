import json
from http import HTTPStatus
from uuid import UUID

from flask import Blueprint, Response, abort, request
from pydantic_core import ValidationError

from db import bookings_db
from models.db_models import JSONEncoder
from models.request_models import BookingRequest
from util.auth_util import token_required
from util.model_util import convert_to_db_booking
from util.util import parse_model

api = Blueprint('bookings', __name__)


@api.route("/bookings", methods=['GET'])
@token_required
def get_all_bookings():
    bookings = bookings_db.get_all_bookings()
    body = [booking.dict() for booking in bookings]
    body_json = json.dumps(body, cls=JSONEncoder)

    return Response(
        status=HTTPStatus.OK,
        content_type='application/json',
        response=body_json
    )


@api.route("/bookings/<booking_id>", methods=['GET'])
@token_required
def get_booking(booking_id: str):
    try:
        uuid = UUID(booking_id)
    except ValueError:
        abort(400, f"{booking_id} is not a valid id")
    booking = bookings_db.get_booking(uuid)

    return Response(
        status=HTTPStatus.OK,
        content_type='application/json',
        response=booking.json()
    )


@api.route("/bookings", methods=['POST'])
@token_required
def create_booking():
    try:
        json_body = request.json
        request_booking = parse_model(BookingRequest, json_body)

        db_booking = convert_to_db_booking(request_booking)
        bookings_db.create_booking(db_booking)

        return Response(
            status=HTTPStatus.CREATED,
            content_type='application/json',
            response=db_booking.json()
        )
    except (ValidationError, ValueError) as e:
        abort(400, str(e))


@api.route("/bookings/<booking_id>", methods=['PATCH'])
@token_required
def update_booking(booking_id: str):
    try:
        booking_uuid = UUID(booking_id)
    except ValueError:
        abort(400, f"{booking_id} is not a valid id")

    try:
        json_body = request.json
        request_booking = BookingRequest(**json_body)

        db_booking = convert_to_db_booking(request_booking)

        updated_user = bookings_db.update_booking(booking_uuid, db_booking)

        return Response(
            status=HTTPStatus.OK,
            content_type='application/json',
            response=updated_user.json()
        )
    except (ValidationError, ValueError) as e:
        abort(400, str(e))
