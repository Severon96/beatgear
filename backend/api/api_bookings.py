import uuid
from collections import defaultdict
from http import HTTPStatus
from uuid import UUID

from flask import Blueprint, abort, request, make_response, jsonify
from pydantic_core import ValidationError

from db import bookings_db
from models.db_models import BookingInquiryDb, BookingDb
from models.models import AuthenticatedUser, BookingRequest, Booking, BookingInquiryRequest, BookingInquiry
from util.auth_util import token_required, user, is_author_or_admin
from util.model_util import convert_to_db_booking, convert_to_db_booking_inquiry, update_db_booking_inquiry_from_request
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


@api.route("/bookings/<booking_id>", methods=['PATCH'])
@token_required
@user
def update_booking(authenticated_user: AuthenticatedUser, booking_id: str):
    try:
        booking_uuid = UUID(booking_id)
    except ValueError:
        abort(make_response(jsonify(message=f"{booking_id} is not a valid id"), HTTPStatus.BAD_REQUEST))

    db_booking = bookings_db.get_booking(booking_uuid)

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
        request_booking_inquiry = parse_model(BookingInquiryRequest, json_body)

        db_booking_inquiry = convert_to_db_booking_inquiry(request_booking_inquiry)
        db_booking_inquiries = _split_booking_inquiry_by_owner(db_booking_inquiry)

        db_booking_inquiries = bookings_db.create_multiple_booking_inquiry(db_booking_inquiries)

        db_booking_inquiries_dicts = [db_booking_inquiry.dict() for db_booking_inquiry in db_booking_inquiries]
        booking_inquiries = parse_model_list(BookingInquiry, db_booking_inquiries_dicts)

        response_payload = [booking_inquiry.model_dump() for booking_inquiry in booking_inquiries]

        return jsonify(response_payload), HTTPStatus.CREATED
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


@api.route("/bookings/inquiries/<inquiry_id>", methods=['GET'])
@token_required
def get_booking_inquiry(inquiry_id: str):
    try:
        booking_inquiry_uuid = UUID(inquiry_id)
    except ValueError:
        abort(make_response(jsonify(message=f"{inquiry_id} is not a valid id"), HTTPStatus.BAD_REQUEST))

    db_booking_inquiry = bookings_db.get_booking_inquiry_by_id(booking_inquiry_uuid)
    booking_inquiry = parse_model(BookingInquiry, db_booking_inquiry.dict())

    return jsonify(booking_inquiry.model_dump()), HTTPStatus.OK


@api.route("/bookings/inquiries/<inquiry_id>", methods=['PATCH'])
@token_required
@user
def update_booking_inquiry(authenticated_user: AuthenticatedUser, inquiry_id: str):
    try:
        booking_inquiry_uuid = UUID(inquiry_id)
    except ValueError:
        abort(make_response(jsonify(message=f"{inquiry_id} is not a valid id"), HTTPStatus.BAD_REQUEST))

    db_booking_inquiry = bookings_db.get_booking_inquiry_by_id(booking_inquiry_uuid)

    is_user_allowed_to_update = is_booking_edit_allowed(authenticated_user, db_booking_inquiry)

    if not is_user_allowed_to_update:
        abort(make_response(jsonify(message="You are not authorized to edit this booking."), HTTPStatus.FORBIDDEN))

    try:
        json_body = request.json
        request_booking_inquiry = BookingInquiryRequest(**json_body)

        db_booking_inquiry = update_db_booking_inquiry_from_request(request_booking_inquiry, db_booking_inquiry)

        updated_booking_inquiry = bookings_db.update_booking_inquiry(booking_inquiry_uuid, db_booking_inquiry)

        booking_inquiry = parse_model(BookingInquiry, updated_booking_inquiry.dict())

        return jsonify(booking_inquiry.model_dump()), HTTPStatus.OK
    except (ValidationError, ValueError) as e:
        abort(make_response(jsonify(message=str(e)), HTTPStatus.BAD_REQUEST))


def _split_booking_inquiry_by_owner(booking_inquiry: BookingInquiryDb) -> list[BookingInquiryDb]:
    hardware_by_owner = defaultdict(list)
    for hardware in booking_inquiry.hardware:
        hardware_by_owner[hardware.owner_id].append(hardware)

    new_booking_inquiries = []
    for owner_id, hardware_list in hardware_by_owner.items():
        new_booking_inquiry = BookingInquiryDb(
            id=uuid.uuid4(),
            customer_id=booking_inquiry.customer_id,
            booking_start=booking_inquiry.booking_start,
            booking_end=booking_inquiry.booking_end,
            author_id=booking_inquiry.author_id,
            total_booking_days=booking_inquiry.total_booking_days,
            total_amount=sum(hardware.price_per_day * booking_inquiry.total_booking_days for hardware in hardware_list),
            hardware=hardware_list
        )
        new_booking_inquiries.append(new_booking_inquiry)

    return new_booking_inquiries


def is_booking_edit_allowed(authenticated_user: AuthenticatedUser, entity: BookingDb | BookingInquiryDb) -> bool:
    is_user_author_or_admin = is_author_or_admin(authenticated_user, entity.author_id)
    hardware_owner_ids = list(map(lambda hardware: hardware.owner_id, entity.hardware))
    is_user_hardware_owner = authenticated_user in hardware_owner_ids

    return is_user_hardware_owner or is_user_author_or_admin
