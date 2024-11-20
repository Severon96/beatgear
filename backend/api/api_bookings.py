import uuid
from collections import defaultdict
from http import HTTPStatus
from uuid import UUID

from flask import Blueprint, abort, request, make_response, jsonify
from pydantic_core import ValidationError

from db import bookings_db
from models.db_models import BookingDb
from models.models import AuthenticatedUser, BookingRequest, Booking
from util.auth_util import token_required, user, is_author_or_admin
from util.model_util import convert_to_db_booking
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

    if db_booking is None:
        abort(
            make_response(
                jsonify(message=f"Booking with id {booking_id} not found"),
                HTTPStatus.NOT_FOUND,
            )
        )

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


@api.route("/bookings/<booking_id>", methods=['PATCH'])
@token_required
@user
def update_booking(authenticated_user: AuthenticatedUser, booking_id: str):
    try:
        booking_uuid = UUID(booking_id)
    except ValueError:
        abort(make_response(jsonify(message=f"{booking_id} is not a valid id"), HTTPStatus.BAD_REQUEST))

    db_booking = bookings_db.get_booking(booking_uuid)

    if db_booking is None:
        abort(
            make_response(
                jsonify(message=f"Booking with id {booking_id} not found"),
                HTTPStatus.NOT_FOUND,
            )
        )

    is_user_allowed_to_update = is_booking_edit_allowed(authenticated_user, db_booking)
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


@api.route("/bookings/inquire", methods=['POST'])
@token_required
def inquire_booking():
    try:
        json_body = request.json
        request_booking = parse_model(BookingRequest, json_body)

        db_booking_inquiry = convert_to_db_booking(request_booking)
        db_booking_inquiries = _split_booking_by_owner(db_booking_inquiry)
        # clean parent booking hardware connections
        db_booking_inquiry.hardware = []
        db_booking_inquiry.children = db_booking_inquiries

        db_booking_inquiry = bookings_db.create_booking(db_booking_inquiry)

        response_booking = parse_model(Booking, db_booking_inquiry.dict())

        return jsonify(response_booking.model_dump()), HTTPStatus.CREATED
    except (ValidationError, ValueError) as e:
        abort(HTTPStatus.BAD_REQUEST, str(e))


def _split_booking_by_owner(booking: BookingDb) -> list[BookingDb]:
    hardware_by_owner = defaultdict(list)
    for hardware in booking.hardware:
        hardware_by_owner[hardware.owner_id].append(hardware)

    new_booking_inquiries = []
    for owner_id, hardware_list in hardware_by_owner.items():
        new_booking = BookingDb(
            id=uuid.uuid4(),
            customer_id=booking.customer_id,
            booking_start=booking.booking_start,
            booking_end=booking.booking_end,
            author_id=booking.author_id,
            total_booking_days=booking.total_booking_days,
            total_amount=sum(hardware.price_per_day * booking.total_booking_days for hardware in hardware_list),
            hardware=hardware_list
        )
        new_booking_inquiries.append(new_booking)

    return new_booking_inquiries


def is_booking_edit_allowed(authenticated_user: AuthenticatedUser, entity: BookingDb) -> bool:
    is_user_author_or_admin = is_author_or_admin(authenticated_user, entity.author_id)
    hardware_owner_ids = list(map(lambda hardware: hardware.owner_id, entity.hardware))
    is_user_hardware_owner = authenticated_user in hardware_owner_ids

    return is_user_hardware_owner or is_user_author_or_admin
