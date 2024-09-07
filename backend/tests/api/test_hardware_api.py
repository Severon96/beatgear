import json
import uuid
from http import HTTPStatus

import pytest

from models.db_models import Hardware, JSONEncoder
from test_util.auth_util import get_user_id_from_jwt
from tests.test_util.db_util import create_hardware, setup_hardware


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
        create_hardware(setup_hardware())
        create_hardware(setup_hardware())

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

    def test_get_hardware_by_id(self, client, jwt):
        # when
        hardware = create_hardware(setup_hardware())

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
        api_hardware = Hardware(**body)
        assert uuid.UUID(api_hardware.id) == hardware.id

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
        json = hardware.json()

        result = client.post(
            "/api/hardware",
            headers={
                'Content-Type': 'application/json',
                'Authorization': f"Bearer {jwt}",
            },
            data=json
        )

        # expect
        print('json body', result.json)
        assert result.status_code == HTTPStatus.CREATED
        body = result.json
        api_hardware = Hardware(**body)
        assert api_hardware.name == hardware.name

    def test_create_hardware_with_missing_hardware_name(self, client, jwt):
        # when
        hardware = setup_hardware()
        hardware_dict = hardware.dict()
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
        hardware_dict = hardware.dict()
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
        api_hardware = Hardware(**body)
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
        api_hardware = Hardware(**body)
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
            data=hardware.json()
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
            data=hardware.json()
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
