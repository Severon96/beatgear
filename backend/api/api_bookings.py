import json
import os
from http import HTTPStatus
from uuid import UUID

import dotenv
from flask import Blueprint, Response, abort, request
from pydantic_core import ValidationError

from db import bookings_db
from models.db_models import JSONEncoder
from models.request_models import BookingRequest, AuthenticatedUser
from util.auth_util import token_required, user, is_author_or_admin
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
@user
def update_booking(authenticated_user: AuthenticatedUser, booking_id: str):
    try:
        booking_uuid = UUID(booking_id)
    except ValueError:
        abort(400, f"{booking_id} is not a valid id")

    print("Authenticated user for admin and stuff", authenticated_user)
    db_booking = bookings_db.get_booking(booking_uuid)
    is_user_allowed_to_update = is_author_or_admin(authenticated_user, db_booking.author_id)
    dotenv_values = dotenv.dotenv_values()
    print('dotenv values', dotenv_values.values())
    admin_role = dotenv_values.get('ADMIN_ROLE_NAME')
    print('admin role name: ', admin_role)
    print('user allowed to update: ', is_user_allowed_to_update)
    if not is_user_allowed_to_update:
        abort(HTTPStatus.FORBIDDEN, "You are not authorized to edit this hardware.")

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
