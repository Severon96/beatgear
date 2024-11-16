from db.hardware_db import get_hardware
from models.db_models import BookingDb, BookingInquiryDb
from models.models import BookingRequest, BookingInquiryRequest


def convert_to_db_booking_inquiry(booking_inquiry: BookingInquiryRequest) -> BookingInquiryDb:
    hardware = []
    for hardware_id in booking_inquiry.hardware_ids:
        request_hardware = get_hardware(hardware_id)
        hardware.append(request_hardware)

    return BookingInquiryDb(
        id=booking_inquiry.id,
        customer_id=booking_inquiry.customer_id,
        hardware=hardware,
        booking_start=booking_inquiry.booking_start,
        booking_end=booking_inquiry.booking_end,
        author_id=booking_inquiry.author_id,
        total_amount=booking_inquiry.total_amount,
        total_booking_days=booking_inquiry.total_booking_days
    )


def convert_to_db_booking(booking_request: BookingRequest) -> BookingDb:
    hardware = []
    for hardware_id in booking_request.hardware_ids:
        request_hardware = get_hardware(hardware_id)
        hardware.append(request_hardware)

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