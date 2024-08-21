import json
import unittest
import uuid
from http import HTTPStatus

import pytest
from chalice.test import Client

from app import app
from models.db_models import Booking, JSONEncoder
from tests.util.db_util import create_booking, setup_booking
from util.model_util import convert_to_booking_request


@pytest.mark.usefixtures("postgres")
class TestBookingApi(unittest.TestCase):

    def test_get_all_bookings_without_bookings(self):
        # then
        with Client(app) as client:
            result = client.http.get("/api/bookings")

            # expect
            assert result.status_code == HTTPStatus.OK
            assert len(result.json_body) == 0

    def test_get_all_bookings_with_bookings(self):
        # when
        create_booking(setup_booking())
        create_booking(setup_booking())

        # then
        with Client(app) as client:
            result = client.http.get("/api/bookings")

            # expect
            assert result.status_code == HTTPStatus.OK
            assert len(result.json_body) == 2

    def test_get_booking_by_id(self):
        # when
        booking = create_booking(setup_booking())

        # then
        with Client(app) as client:
            result = client.http.get(f"/api/bookings/{booking.id}")

            # expect
            assert result.status_code == HTTPStatus.OK
            body = result.json_body
            assert body is not None
            api_booking = Booking(**body)
            assert uuid.UUID(api_booking.id) == booking.id

    def test_get_missing_booking_by_id(self):
        # then
        with Client(app) as client:
            result = client.http.get(f"/api/bookings/{uuid.uuid4()}")

            # expect
            assert result.status_code == HTTPStatus.NOT_FOUND

    def test_get_booking_by_malformed_uuid(self):
        # then
        with Client(app) as client:
            result = client.http.get(f"/api/bookings/test")

            # expect
            assert result.status_code == HTTPStatus.BAD_REQUEST

    def test_create_booking(self):
        # when
        booking = setup_booking()

        # then
        with Client(app) as client:
            result = client.http.post(
                "/api/bookings",
                headers={'Content-Type': 'application/json'},
                body=booking.model_dump_json()
            )

            # expect
            assert result.status_code == HTTPStatus.CREATED
            body = result.json_body
            api_booking = Booking(**body)
            assert api_booking.name == booking.name
            assert len(api_booking.hardware) == 2

    def test_create_booking_with_missing_booking_name(self):
        # when
        booking = setup_booking()
        booking_dict = booking.dict()
        booking_dict['hardware_ids'] = ['test']
        booking_dict['customer_id'] = None

        # then
        with Client(app) as client:
            result = client.http.post(
                "/api/bookings",
                headers={'Content-Type': 'application/json'},
                body=json.dumps(booking_dict, cls=JSONEncoder)
            )

            # expect
            assert result.status_code == HTTPStatus.BAD_REQUEST

    def test_update_booking(self):
        # when
        booking = create_booking(setup_booking())
        booking.name = "updated_booking_name"

        request_booking = convert_to_booking_request(booking)

        # then
        with Client(app) as client:
            result = client.http.patch(
                f"/api/bookings/{booking.id}",
                headers={'Content-Type': 'application/json'},
                body=request_booking.model_dump_json()
            )

            # expect
            assert result.status_code == HTTPStatus.OK
            body = result.json_body
            api_booking = Booking(**body)
            assert api_booking.name == booking.name

    def test_update_missing_booking(self):
        # when
        booking = setup_booking()
        booking.name = "updated_booking_name"

        # then
        with Client(app) as client:
            result = client.http.patch(
                f"/api/bookings/{uuid.uuid4()}",
                headers={'Content-Type': 'application/json'},
                body=booking.json()
            )

            # expect
            assert result.status_code == HTTPStatus.NOT_FOUND

    def test_update_booking_with_missing_booking_customer_id(self):
        # when
        booking = create_booking(setup_booking())
        booking_dict = booking.dict()
        booking_dict['customer_id'] = None

        # then
        with Client(app) as client:
            result = client.http.patch(
                f"/api/bookings/{booking.id}",
                headers={'Content-Type': 'application/json'},
                body=json.dumps(booking_dict, cls=JSONEncoder)
            )

            # expect
            assert result.status_code == HTTPStatus.BAD_REQUEST
