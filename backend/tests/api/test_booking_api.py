import json
import uuid
from http import HTTPStatus

import pytest

from models.db_models import Booking, JSONEncoder
from test_util.auth_util import get_user_id_from_jwt
from tests.test_util.db_util import create_booking, setup_booking
from util.model_util import convert_to_booking_request


@pytest.mark.usefixtures("postgres")
class TestBookingApi:

    def test_get_all_bookings_without_bookings(self, client, jwt):
        # then
        result = client.get(
            "/api/bookings",
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {jwt}"
            }
        )

        # expect
        assert result.status_code == HTTPStatus.OK
        assert len(result.json) == 0

    def test_get_all_bookings_with_bookings(self, client, jwt):
        # when
        create_booking(setup_booking())
        create_booking(setup_booking())

        # then
        result = client.get(
            "/api/bookings",
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {jwt}"
            }
        )

        # expect
        assert result.status_code == HTTPStatus.OK
        assert len(result.json) == 2

    def test_get_booking_by_id(self, client, jwt):
        # when
        booking = create_booking(setup_booking())

        # then
        result = client.get(
            f"/api/bookings/{booking.id}",
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {jwt}"
            }
        )

        # expect
        assert result.status_code == HTTPStatus.OK
        body = result.json
        assert body is not None
        api_booking = Booking(**body)
        assert uuid.UUID(api_booking.id) == booking.id

    def test_get_missing_booking_by_id(self, client, jwt):
        # then
        result = client.get(
            f"/api/bookings/{uuid.uuid4()}",
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {jwt}"
            }
        )

        # expect
        assert result.status_code == HTTPStatus.NOT_FOUND

    def test_get_booking_by_malformed_uuid(self, client, jwt):
        # then
        result = client.get(
            f"/api/bookings/test",
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {jwt}"
            }
        )

        # expect
        assert result.status_code == HTTPStatus.BAD_REQUEST

    def test_create_booking(self, client, jwt):
        # when
        booking = setup_booking()

        # then
        result = client.post(
            "/api/bookings",
            headers={
                'Content-Type': 'application/json',
                'Authorization': f"Bearer {jwt}",
            },
            data=booking.model_dump_json()
        )

        # expect
        assert result.status_code == HTTPStatus.CREATED
        body = result.json
        api_booking = Booking(**body)
        assert api_booking.name == booking.name
        assert len(api_booking.hardware) == 2

    def test_create_booking_with_missing_jwt(self, client):
        # when
        booking = setup_booking()
        booking_dict = booking.model_dump()
        booking_dict['hardware_ids'] = ['test']
        booking_dict['customer_id'] = None

        # then
        result = client.post(
            "/api/bookings",
            headers={
                'Content-Type': 'application/json',
            },
            data=json.dumps(booking_dict, cls=JSONEncoder)
        )

        # expect
        assert result.status_code == HTTPStatus.UNAUTHORIZED

    def test_create_booking_with_missing_booking_name(self, client, jwt):
        # when
        booking = setup_booking()
        booking_dict = booking.model_dump()
        booking_dict['hardware_ids'] = ['test']
        booking_dict['customer_id'] = None

        # then
        result = client.post(
            "/api/bookings",
            headers={
                'Content-Type': 'application/json',
                'Authorization': f"Bearer {jwt}",
            },
            data=json.dumps(booking_dict, cls=JSONEncoder)
        )

        # expect
        assert result.status_code == HTTPStatus.BAD_REQUEST

    def test_update_booking_as_author(self, client, jwt):
        # when
        user_id_from_token = get_user_id_from_jwt(jwt)

        booking = create_booking(setup_booking(author_id=uuid.UUID(user_id_from_token)))
        booking.name = "updated_booking_name"

        request_booking = convert_to_booking_request(booking)

        # then
        result = client.patch(
            f"/api/bookings/{booking.id}",
            headers={
                'Content-Type': 'application/json',
                'Authorization': f"Bearer {jwt}",
            },
            data=request_booking.model_dump_json()
        )

        # expect
        assert result.status_code == HTTPStatus.OK
        body = result.json
        api_booking = Booking(**body)
        assert api_booking.name == booking.name

    def test_update_booking_as_admin(self, client, jwt_admin):
        # when
        booking = create_booking(setup_booking())
        booking.name = "updated_booking_name"

        request_booking = convert_to_booking_request(booking)

        # then
        result = client.patch(
            f"/api/bookings/{booking.id}",
            headers={
                'Content-Type': 'application/json',
                'Authorization': f"Bearer {jwt_admin}",
            },
            data=request_booking.model_dump_json()
        )

        # expect
        assert result.status_code == HTTPStatus.OK
        body = result.json
        api_booking = Booking(**body)
        assert api_booking.name == booking.name

    def test_update_no_author_or_admin(self, client, jwt):
        # when
        booking = create_booking(setup_booking())
        booking.name = "updated_booking_name"

        request_booking = convert_to_booking_request(booking)

        # then
        result = client.patch(
            f"/api/bookings/{booking.id}",
            headers={
                'Content-Type': 'application/json',
                'Authorization': f"Bearer {jwt}",
            },
            data=request_booking.model_dump_json()
        )

        # expect
        assert result.status_code == HTTPStatus.FORBIDDEN

    def test_update_missing_jwt(self, client):
        # when
        booking = setup_booking()
        booking.name = "updated_booking_name"

        # then
        result = client.patch(
            f"/api/bookings/{uuid.uuid4()}",
            headers={
                'Content-Type': 'application/json',
            },
            data=booking.model_dump_json()
        )

        # expect
        assert result.status_code == HTTPStatus.UNAUTHORIZED

    def test_update_missing_booking(self, client, jwt):
        # when
        booking = setup_booking()
        booking.name = "updated_booking_name"

        # then
        result = client.patch(
            f"/api/bookings/{uuid.uuid4()}",
            headers={
                'Content-Type': 'application/json',
                'Authorization': f"Bearer {jwt}",
            },
            data=booking.model_dump_json()
        )

        # expect
        assert result.status_code == HTTPStatus.NOT_FOUND

    def test_update_booking_with_missing_booking_customer_id(self, client, jwt):
        # when
        user_id_from_token = get_user_id_from_jwt(jwt)

        booking = create_booking(setup_booking(author_id=uuid.UUID(user_id_from_token)))
        booking_dict = booking.dict()
        booking_dict['customer_id'] = None

        # then
        result = client.patch(
            f"/api/bookings/{booking.id}",
            headers={
                'Content-Type': 'application/json',
                'Authorization': f"Bearer {jwt}",
            },
            data=json.dumps(booking_dict, cls=JSONEncoder)
        )

        # expect
        assert result.status_code == HTTPStatus.BAD_REQUEST
