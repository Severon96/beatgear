import json
import uuid
from datetime import datetime, timedelta
from http import HTTPStatus

import pytest

from models.db_models import JSONEncoder
from models.models import Hardware
from tests.test_util.auth_util import get_user_id_from_jwt
from tests.test_util.db_util import create_hardware, setup_hardware, create_booking, setup_booking
from util.util import parse_model


@pytest.mark.usefixtures("postgres")
class TestHardwareApi:

    def test_get_all_hardware_without_hardware(self, client, jwt):
        # then
        result = client.get("/api/hardware",
                            headers={
                                "Content-Type": "application/json",
                                "Authorization": f"Bearer {jwt}"
                            }
                            )

        # expect
        assert result.status_code == HTTPStatus.OK
        assert len(result.json) == 0

    def test_get_all_hardware_with_hardware(self, client, jwt):
        # when
        user_id = get_user_id_from_jwt(jwt)

        create_hardware()
        create_hardware()
        create_hardware(setup_hardware(user_uuid=user_id))

        # then
        result = client.get("/api/hardware",
                            headers={
                                "Content-Type": "application/json",
                                "Authorization": f"Bearer {jwt}"
                            }
                            )

        # expect
        assert result.status_code == HTTPStatus.OK
        assert len(result.json) == 2

        hardware = [parse_model(Hardware, json.loads(hardware_json)) for hardware_json in result.json]
        hardware_owner_ids = list(map(lambda hw: hw.owner_id, hardware))
        assert user_id not in hardware_owner_ids

    def test_get_all_hardware_available_in_timeframe_with_hardware(self, client, jwt):
        # when
        user_id = get_user_id_from_jwt(jwt)

        hardware_1 = create_hardware()
        hardware_2 = create_hardware()
        hardware_3 = create_hardware()
        create_hardware(setup_hardware(user_uuid=user_id))

        now = datetime.now()
        yesterday = now - timedelta(days=1)
        tomorrow = now + timedelta(days=1)
        day_after_tomorrow = tomorrow + timedelta(days=1)
        in_three_days = day_after_tomorrow + timedelta(days=1)

        create_booking(
            setup_booking(
                booking_start=yesterday,
                booking_end=tomorrow,
                hardware_ids=[hardware_1.id]
            )
        )

        create_booking(
            setup_booking(
                booking_start=yesterday,
                booking_end=now,
                hardware_ids=[hardware_2.id]
            )
        )

        # then
        data = {
            "booking_start": now,
            "booking_end": in_three_days,
        }

        result = client.get("/api/hardware",
                            headers={
                                "Content-Type": "application/json",
                                "Authorization": f"Bearer {jwt}"
                            },
                            query_string=data
                            )

        # expect
        assert result.status_code == HTTPStatus.OK
        hardware = [parse_model(Hardware, json.loads(hardware_json)) for hardware_json in result.json]
        assert len(hardware) == 1
        assert hardware[0].id == hardware_3.id

    def test_get_hardware_by_id(self, client, jwt):
        # when
        hardware = create_hardware()

        # then
        result = client.get(f"/api/hardware/{hardware.id}",
                            headers={
                                "Content-Type": "application/json",
                                "Authorization": f"Bearer {jwt}"
                            }
                            )

        # expect
        assert result.status_code == HTTPStatus.OK
        body = result.json
        assert body is not None
        api_hardware = parse_model(Hardware, json.loads(body))
        assert api_hardware.id == hardware.id

    def test_get_missing_hardware_by_id(self, client, jwt):
        # then
        result = client.get(f"/api/hardware/{uuid.uuid4()}",
                            headers={
                                "Content-Type": "application/json",
                                "Authorization": f"Bearer {jwt}"
                            }
                            )

        # expect
        assert result.status_code == HTTPStatus.NOT_FOUND

    def test_get_hardware_by_malformed_uuid(self, client, jwt):
        # then
        result = client.get(f"/api/hardware/test",
                            headers={
                                "Content-Type": "application/json",
                                "Authorization": f"Bearer {jwt}"
                            }
                            )

        # expect
        assert result.status_code == HTTPStatus.BAD_REQUEST

    def test_create_hardware(self, client, jwt):
        # when
        hardware = setup_hardware()

        # then
        request = hardware.model_dump_json()

        result = client.post(
            "/api/hardware",
            headers={
                'Content-Type': 'application/json',
                'Authorization': f"Bearer {jwt}",
            },
            data=request
        )

        # expect
        assert result.status_code == HTTPStatus.CREATED
        body = result.json
        api_hardware = parse_model(Hardware, json.loads(body))
        assert api_hardware.name == hardware.name

    def test_create_hardware_with_missing_hardware_name(self, client, jwt):
        # when
        hardware = setup_hardware()
        hardware_dict = hardware.model_dump()
        hardware_dict['name'] = None

        # then
        result = client.post(
            "/api/hardware",
            headers={
                'Content-Type': 'application/json',
                'Authorization': f"Bearer {jwt}",
            },
            data=json.dumps(hardware_dict, cls=JSONEncoder)
        )

        # expect
        assert result.status_code == HTTPStatus.BAD_REQUEST

    def test_create_hardware_with_missing_jwt(self, client):
        # when
        hardware = setup_hardware()
        hardware_dict = hardware.model_dump()
        hardware_dict['name'] = None

        # then
        result = client.post(
            "/api/hardware",
            headers={
                'Content-Type': 'application/json',
            },
            data=json.dumps(hardware_dict, cls=JSONEncoder)
        )

        # expect
        assert result.status_code == HTTPStatus.UNAUTHORIZED

    def test_update_hardware_as_author(self, client, jwt):
        # when
        user_id_from_jwt = get_user_id_from_jwt(jwt)

        hardware = create_hardware(setup_hardware(user_uuid=user_id_from_jwt))
        hardware.name = "updated_hardware_name"

        # then
        result = client.patch(
            f"/api/hardware/{hardware.id}",
            headers={
                'Content-Type': 'application/json',
                'Authorization': f"Bearer {jwt}",
            },
            data=hardware.json()
        )

        # expect
        assert result.status_code == HTTPStatus.OK
        body = result.json
        api_hardware = parse_model(Hardware, json.loads(body))
        assert api_hardware.name == hardware.name

    def test_update_hardware_as_admin(self, client, jwt_admin):
        # when
        hardware = create_hardware(setup_hardware())
        hardware.name = "updated_hardware_name"

        # then
        result = client.patch(
            f"/api/hardware/{hardware.id}",
            headers={
                'Content-Type': 'application/json',
                'Authorization': f"Bearer {jwt_admin}",
            },
            data=hardware.json()
        )

        # expect
        assert result.status_code == HTTPStatus.OK
        body = result.json
        api_hardware = parse_model(Hardware, json.loads(body))
        assert api_hardware.name == hardware.name

    def test_update_hardware_without_being_admin_or_author(self, client, jwt):
        # when
        hardware = create_hardware(setup_hardware(user_uuid=uuid.uuid4()))
        hardware.name = "updated_hardware_name"

        # then
        result = client.patch(
            f"/api/hardware/{hardware.id}",
            headers={
                'Content-Type': 'application/json',
                'Authorization': f"Bearer {jwt}",
            },
            data=hardware.json()
        )

        # expect
        assert result.status_code == HTTPStatus.FORBIDDEN

    def test_update_missing_hardware(self, client, jwt):
        # when
        hardware = setup_hardware()
        hardware.name = "updated_hardware_name"

        # then
        result = client.patch(
            f"/api/hardware/{uuid.uuid4()}",
            headers={
                'Content-Type': 'application/json',
                'Authorization': f"Bearer {jwt}",
            },
            data=hardware.model_dump()
        )

        # expect
        assert result.status_code == HTTPStatus.NOT_FOUND

    def test_update_missing_jwt(self, client):
        # when
        hardware = setup_hardware()
        hardware.name = "updated_hardware_name"

        # then
        result = client.patch(
            f"/api/hardware/{uuid.uuid4()}",
            headers={
                'Content-Type': 'application/json',
            },
            data=hardware.model_dump()
        )

        # expect
        assert result.status_code == HTTPStatus.UNAUTHORIZED

    def test_update_hardware_with_missing_hardware_name(self, client, jwt):
        # when
        user_id_from_jwt = get_user_id_from_jwt(jwt)

        hardware = create_hardware(setup_hardware(user_uuid=user_id_from_jwt))
        hardware_dict = hardware.dict()
        hardware_dict['name'] = None

        # then
        result = client.patch(
            f"/api/hardware/{hardware.id}",
            headers={
                'Content-Type': 'application/json',
                'Authorization': f"Bearer {jwt}",
            },
            data=json.dumps(hardware_dict, cls=JSONEncoder)
        )

        # expect
        assert result.status_code == HTTPStatus.BAD_REQUEST
