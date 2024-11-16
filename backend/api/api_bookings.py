from http import HTTPStatus
from uuid import UUID

from flask import Blueprint, abort, request, make_response, jsonify
from pydantic_core import ValidationError

from db import bookings_db
from models.models import AuthenticatedUser, BookingRequest, Booking, BookingInquiryRequest, BookingInquiry
from util.auth_util import token_required, user, is_author_or_admin
from util.model_util import convert_to_db_booking, convert_to_db_booking_inquiry
from util.util import parse_model, parse_model_list

api = Blueprint('bookings', __name__)


@api.route("/bookings", methods=['GET'])
@token_required
def get_all_bookings():
    db_bookings = bookings_db.get_all_bookings()
    bookings = parse_model_list(Booking, [booking.dict() for booking in db_bookings])
    response_payload = [booking.model_dump_json() for booking in bookings]

    return jsonify(response_payload), HTTPStatus.OK


@api.route("/bookings/current", methods=['GET'])
@token_required
@user
def get_active_bookings(authenticated_user: AuthenticatedUser):
    db_bookings = bookings_db.get_current_bookings_for_user(authenticated_user.id)
    bookings = parse_model_list(Booking, [booking.dict() for booking in db_bookings])
    response_payload = [booking.model_dump() for booking in bookings]

    return jsonify(response_payload), HTTPStatus.OK


@api.route("/bookings/<booking_id>", methods=['GET'])
@token_required
def get_booking(booking_id: str):
    try:
        uuid = UUID(booking_id)
    except ValueError:
        abort(make_response(jsonify(message=f"{booking_id} is not a valid id"), HTTPStatus.BAD_REQUEST))

    db_booking = bookings_db.get_booking(uuid)
    booking = parse_model(Booking, db_booking.dict())

    return jsonify(booking.model_dump()), HTTPStatus.OK


@api.route("/bookings", methods=['POST'])
@token_required
def create_booking():
    try:
        json_body = request.json
        request_booking = parse_model(BookingRequest, json_body)

        db_booking = convert_to_db_booking(request_booking)
        db_booking = bookings_db.create_booking(db_booking)

        booking = parse_model(Booking, db_booking.dict())

        return jsonify(booking.model_dump()), HTTPStatus.CREATED
    except (ValidationError, ValueError) as e:
        abort(HTTPStatus.BAD_REQUEST, str(e))


@api.route("/bookings/inquire", methods=['POST'])
@token_required
def inquire_booking():
    try:
        json_body = request.json
        request_booking_inquiry = parse_model(BookingInquiryRequest, json_body)

        db_booking_inquiry = convert_to_db_booking_inquiry(request_booking_inquiry)
        db_booking_inquiry = bookings_db.create_booking_inquiry(db_booking_inquiry)

        booking_inquiry = parse_model(BookingInquiry, db_booking_inquiry.dict())

        return jsonify(booking_inquiry.model_dump()), HTTPStatus.CREATED
    except (ValidationError, ValueError) as e:
        abort(HTTPStatus.BAD_REQUEST, str(e))


@api.route("/bookings/inquiries", methods=['GET'])
@token_required
@user
def get_booking_inquiries(authenticated_user: AuthenticatedUser):
    try:
        db_booking_inquiries = bookings_db.get_current_booking_inquiries_for_user(authenticated_user.id)

        booking_inquiries = parse_model_list(BookingInquiry, [booking.dict() for booking in db_booking_inquiries])
        response_payload = [booking_inquiry.model_dump() for booking_inquiry in booking_inquiries]

        return jsonify(response_payload), HTTPStatus.OK
    except (ValidationError, ValueError) as e:
        abort(HTTPStatus.BAD_REQUEST, str(e))


@api.route("/bookings/<booking_id>", methods=['PATCH'])
@token_required
@user
def update_booking(authenticated_user: AuthenticatedUser, booking_id: str):
    try:
        booking_uuid = UUID(booking_id)
    except ValueError:
        abort(make_response(jsonify(message=f"{booking_id} is not a valid id"), HTTPStatus.BAD_REQUEST))

    db_booking = bookings_db.get_booking(booking_uuid)

    is_user_allowed_to_update = is_author_or_admin(authenticated_user, db_booking.author_id)
    if not is_user_allowed_to_update:
        abort(make_response(jsonify(message="You are not authorized to edit this booking."), HTTPStatus.FORBIDDEN))

    try:
        json_body = request.json
        request_booking = BookingRequest(**json_body)

        db_booking = convert_to_db_booking(request_booking)

        updated_booking = bookings_db.update_booking(booking_uuid, db_booking)

        booking = parse_model(Booking, updated_booking.dict())

        return jsonify(booking.model_dump()), HTTPStatus.OK
    except (ValidationError, ValueError) as e:
        abort(make_response(jsonify(message=str(e)), HTTPStatus.BAD_REQUEST))
