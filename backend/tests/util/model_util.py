from typing import List

from models.db_models import Booking, Hardware
from models.request_models import BookingRequest


def convert_to_db_booking(booking_request: BookingRequest, hardware: List[Hardware]) -> Booking:
    return Booking(
        id=booking_request.id,
        name=booking_request.name,
        customer_id=booking_request.customer_id,
        hardware=hardware,
        booking_start=booking_request.booking_start,
        booking_end=booking_request.booking_end
    )