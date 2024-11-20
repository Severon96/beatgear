import json
import uuid
from datetime import datetime, timedelta
from http import HTTPStatus

import pytest

from models.db_models import JSONEncoder
from models.models import Booking
from test_util import db_util
from tests.test_util.auth_util import get_user_id_from_jwt
from tests.test_util.db_util import create_booking, setup_booking
from util.model_util import convert_to_booking_request
from util.util import parse_model, parse_model_list


@pytest.mark.usefixtures("postgres")
class TestBookingApi:

    def test_get_all_bookings_without_bookings(self, client, jwt):
        # then
        result = client.get(
            "/api/bookings",
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {jwt}",
            },
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
                "Authorization": f"Bearer {jwt}",
            },
        )

        # expect
        assert result.status_code == HTTPStatus.OK
        assert len(result.json) == 2

    def test_get_active_bookings_without_bookings(self, client, jwt):
        # then
        result = client.get(
            "/api/bookings/current",
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {jwt}",
            },
        )

        # expect
        assert result.status_code == HTTPStatus.OK
        assert len(result.json) == 0

    def test_get_active_bookings_with_bookings(self, client, jwt):
        # when
        user_id_from_token = get_user_id_from_jwt(jwt)

        yesterday = datetime.now() - timedelta(days=1)
        tomorrow = datetime.now() + timedelta(days=1)
        create_booking(setup_booking())
        create_booking(
            setup_booking(
                customer_id=uuid.UUID(user_id_from_token),
                booking_start=yesterday,
                booking_end=tomorrow,
            )
        )

        # then
        result = client.get(
            "/api/bookings/current",
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {jwt}",
            },
        )

        # expect
        assert result.status_code == HTTPStatus.OK
        assert len(result.json) == 1

    def test_get_active_booking_with_missing_jwt(self, client, jwt):
        # when
        yesterday = datetime.now() - timedelta(days=1)
        tomorrow = datetime.now() + timedelta(days=1)
        create_booking(setup_booking())
        create_booking(setup_booking(booking_start=yesterday, booking_end=tomorrow))

        # then
        result = client.get(
            "/api/bookings/current",
            headers={
                "Content-Type": "application/json",
            },
        )

        # expect
        assert result.status_code == HTTPStatus.UNAUTHORIZED

    def test_get_booking_by_id(self, client, jwt):
        # when
        booking = create_booking(setup_booking())

        # then
        result = client.get(
            f"/api/bookings/{booking.id}",
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {jwt}",
            },
        )

        # expect
        assert result.status_code == HTTPStatus.OK
        api_booking = parse_model(Booking, result.json)
        assert api_booking.id == booking.id

    def test_get_missing_booking_by_id(self, client, jwt):
        # then
        result = client.get(
            f"/api/bookings/{uuid.uuid4()}",
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {jwt}",
            },
        )

        # expect
        assert result.status_code == HTTPStatus.NOT_FOUND

    def test_get_booking_by_malformed_uuid(self, client, jwt):
        # then
        result = client.get(
            f"/api/bookings/test",
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {jwt}",
            },
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
                "Content-Type": "application/json",
                "Authorization": f"Bearer {jwt}",
            },
            data=booking.model_dump_json(),
        )

        # expect
        assert result.status_code == HTTPStatus.CREATED
        api_booking = parse_model(Booking, result.json)
        assert api_booking.name == booking.name
        assert len(api_booking.hardware) == 2

    def test_create_booking_with_missing_hardware(self, client, jwt):
        # when
        booking = setup_booking()
        random_uuid = uuid.uuid4()
        booking.hardware_ids = [random_uuid]

        # then
        result = client.post(
            "/api/bookings",
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {jwt}",
            },
            data=booking.model_dump_json(),
        )

        # expect
        assert result.status_code == HTTPStatus.BAD_REQUEST
        assert result.json["message"] == f"No available hardware provided"

    def test_create_booking_with_empty_hardware(self, client, jwt):
        # when
        booking = setup_booking()
        booking.hardware_ids = []

        # then
        result = client.post(
            "/api/bookings",
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {jwt}",
            },
            data=booking.model_dump_json(),
        )

        # expect
        assert result.status_code == HTTPStatus.BAD_REQUEST
        assert result.json["message"] == f"No available hardware provided"

    def test_create_booking_with_missing_jwt(self, client):
        # when
        booking = setup_booking()
        booking_dict = booking.model_dump()
        booking_dict["hardware_ids"] = ["test"]
        booking_dict["customer_id"] = None

        # then
        result = client.post(
            "/api/bookings",
            headers={
                "Content-Type": "application/json",
            },
            data=json.dumps(booking_dict, cls=JSONEncoder),
        )

        # expect
        assert result.status_code == HTTPStatus.UNAUTHORIZED

    def test_create_booking_with_missing_booking_name(self, client, jwt):
        # when
        booking = setup_booking()
        booking_dict = booking.model_dump()
        booking_dict["hardware_ids"] = ["test"]
        booking_dict["customer_id"] = None

        # then
        result = client.post(
            "/api/bookings",
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {jwt}",
            },
            data=json.dumps(booking_dict, cls=JSONEncoder),
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
                "Content-Type": "application/json",
                "Authorization": f"Bearer {jwt}",
            },
            data=request_booking.model_dump_json(),
        )

        # expect
        assert result.status_code == HTTPStatus.OK
        api_booking = parse_model(Booking, result.json)
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
                "Content-Type": "application/json",
                "Authorization": f"Bearer {jwt_admin}",
            },
            data=request_booking.model_dump_json(),
        )

        # expect
        assert result.status_code == HTTPStatus.OK
        api_booking = parse_model(Booking, result.json)
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
                "Content-Type": "application/json",
                "Authorization": f"Bearer {jwt}",
            },
            data=request_booking.model_dump_json(),
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
                "Content-Type": "application/json",
            },
            data=booking.model_dump_json(),
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
                "Content-Type": "application/json",
                "Authorization": f"Bearer {jwt}",
            },
            data=booking.model_dump_json(),
        )

        # expect
        assert result.status_code == HTTPStatus.NOT_FOUND

    def test_update_booking_with_missing_booking_customer_id(self, client, jwt):
        # when
        user_id_from_token = get_user_id_from_jwt(jwt)

        booking = create_booking(setup_booking(author_id=uuid.UUID(user_id_from_token)))
        booking_dict = booking.dict()
        booking_dict["customer_id"] = None

        # then
        result = client.patch(
            f"/api/bookings/{booking.id}",
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {jwt}",
            },
            data=json.dumps(booking_dict, cls=JSONEncoder),
        )

        # expect
        assert result.status_code == HTTPStatus.BAD_REQUEST

    def test_create_booking_inquiry(self, client, jwt):
        # when
        user_uuid_1 = uuid.uuid4()
        user_uuid_2 = uuid.uuid4()
        hardware_1 = db_util.create_hardware(
            db_util.setup_hardware(user_uuid=user_uuid_1)
        )
        hardware_2 = db_util.create_hardware(
            db_util.setup_hardware(user_uuid=user_uuid_1)
        )
        hardware_3 = db_util.create_hardware(
            db_util.setup_hardware(user_uuid=user_uuid_2)
        )
        booking = db_util.setup_booking(
            total_booking_days=2,
            hardware_ids=[hardware_1.id, hardware_2.id, hardware_3.id],
        )

        # then
        result = client.post(
            "/api/bookings/inquire",
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {jwt}",
            },
            data=booking.model_dump_json(),
        )

        # expect
        assert result.status_code == HTTPStatus.CREATED
        api_booking = parse_model_list(Booking, result.json)
        assert api_booking[0].customer_id == booking.customer_id
        assert api_booking[0].total_amount == 280.0
        assert api_booking[1].customer_id == booking.customer_id
        assert api_booking[1].total_amount == 140.0
        assert len(api_booking[0].hardware) == 2
        assert len(api_booking[1].hardware) == 1
        assert (
            api_booking[0].hardware[0].owner_id != api_booking[1].hardware[0].owner_id
        )

    def test_create_booking_inquiry_with_missing_hardware(self, client, jwt):
        # when
        random_uuid = uuid.uuid4()
        booking = db_util.setup_booking(
            total_booking_days=2,
            hardware_ids=[random_uuid],
        )

        # then
        result = client.post(
            "/api/bookings/inquire",
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {jwt}",
            },
            data=booking.model_dump_json(),
        )

        # expect
        assert result.status_code == HTTPStatus.BAD_REQUEST
        assert result.json["message"] == f"No available hardware provided"

    def test_create_booking_inquiry_with_empty_hardware(self, client, jwt):
        # when
        booking = db_util.setup_booking(
            total_booking_days=2,
            hardware_ids=[],
        )

        # then
        result = client.post(
            "/api/bookings/inquire",
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {jwt}",
            },
            data=booking.model_dump_json(),
        )

        # expect
        assert result.status_code == HTTPStatus.BAD_REQUEST
        assert result.json["message"] == f"No available hardware provided"

    def test_create_booking_inquiry_with_missing_jwt(self, client):
        # when
        booking = db_util.setup_booking(
            total_booking_days=2,
        )

        # then
        result = client.post(
            "/api/bookings/inquire",
            headers={
                "Content-Type": "application/json",
            },
            data=booking.model_dump(),
        )

        # expect
        assert result.status_code == HTTPStatus.UNAUTHORIZED

    def test_create_booking_inquiry_with_missing_total_booking_days(self, client, jwt):
        # when
        booking = db_util.setup_booking(
            total_booking_days=2,
        )
        booking_dict = booking.model_dump()
        booking_dict["total_booking_days"] = None

        # then
        result = client.post(
            "/api/bookings/inquire",
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {jwt}",
            },
            data=json.dumps(booking_dict, cls=JSONEncoder),
        )

        # expect
        assert result.status_code == HTTPStatus.BAD_REQUEST
