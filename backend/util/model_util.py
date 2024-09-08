from db.hardware_db import get_hardware
from models.db_models import Booking
from models.request_models import BookingRequest


def convert_to_db_booking(booking_request: BookingRequest) -> Booking:
    hardware = []
    for hardware_id in booking_request.hardware_ids:
        request_hardware = get_hardware(hardware_id)
        hardware.append(request_hardware)

    return Booking(
        id=booking_request.id,
        name=booking_request.name,
        customer_id=booking_request.customer_id,
        hardware=hardware,
        booking_start=booking_request.booking_start,
        booking_end=booking_request.booking_end,
        author_id=booking_request.author_id,
    )


def convert_to_booking_request(booking: Booking) -> BookingRequest:
    return BookingRequest(
        id=booking.id,
        name=booking.name,
        customer_id=booking.customer_id,
        hardware_ids=[hardware.id for hardware in booking.hardware],
        booking_start=booking.booking_start,
        booking_end=booking.booking_end,
        author_id=booking.author_id,
    )