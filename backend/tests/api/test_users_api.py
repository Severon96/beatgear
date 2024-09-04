import json
import uuid
from datetime import datetime
from http import HTTPStatus

import pytest

from models.db_models import User, JSONEncoder
from tests.util.db_util import create_user, setup_user


@pytest.mark.usefixtures("postgres")
class TestUserApi:

    def test_get_all_users_without_users(self, client, jwt):
        # then
        result = client.get("/api/users")

        # expect
        assert result.status_code == HTTPStatus.OK
        assert len(result.json) == 0

    def test_get_all_users_with_users(self, client):
        # when
        create_user(setup_user())
        create_user(setup_user())

        # then
        result = client.get("/api/users")

        # expect
        assert result.status_code == HTTPStatus.OK
        assert len(result.json) == 2

    def test_get_user_by_id(self, client):
        # when
        user = create_user(setup_user())

        # then
        result = client.get(f"/api/users/{user.id}")

        # expect
        assert result.status_code == HTTPStatus.OK
        result_body = result.json
        assert result_body is not None
        api_user = User(**result_body)
        assert uuid.UUID(api_user.id) == user.id

    def test_get_missing_user_by_id(self, client):
        # then
        result = client.get(f"/api/users/{uuid.uuid4()}")

        # expect
        assert result.status_code == HTTPStatus.NOT_FOUND

    def test_get_user_by_malformed_uuid(self, client):
        # then
        result = client.get(f"/api/users/test")

        # expect
        assert result.status_code == HTTPStatus.BAD_REQUEST

    def test_create_user(self, client):
        # when
        user = setup_user()

        # then
        result = client.post(
            "/api/users",
            headers={'Content-Type': 'application/json'},
            data=user.json()
        )

        # expect
        assert result.status_code == HTTPStatus.CREATED
        body = result.json
        api_user = User(**body)
        assert api_user.username == user.username

    def test_create_user_with_missing_username(self, client):
        # when
        user_dict = {
            'id': uuid.uuid4(),
            'username': None,
            'first_name': 'Test',
            'last_name': 'User',
            'created_at': datetime.now(),
            'updated_at': datetime.now()
        }

        # then
        result = client.post(
            "/api/users",
            headers={'Content-Type': 'application/json'},
            data=json.dumps(user_dict, cls=JSONEncoder)
        )

        # expect
        assert result.status_code == HTTPStatus.BAD_REQUEST

    def test_update_user(self, client):
        # when
        user = create_user(setup_user())
        user.username = "updated_username"

        # then
        result = client.patch(
            f"/api/users/{user.id}",
            headers={'Content-Type': 'application/json'},
            data=user.json()
        )

        # expect
        assert result.status_code == HTTPStatus.OK
        body = result.json
        api_user = User(**body)
        assert api_user.username == user.username

    def test_update_missing_user(self, client):
        # when
        user = setup_user()
        user.username = "updated_username"

        # then
        result = client.patch(
            f"/api/users/{uuid.uuid4()}",
            headers={'Content-Type': 'application/json'},
            data=user.json()
        )

        # expect
        assert result.status_code == HTTPStatus.NOT_FOUND

    def test_update_user_with_missing_username(self, client):
        # when
        user = create_user(setup_user())
        user_dict = user.dict()
        user_dict['username'] = None

        # then
        result = client.patch(
            f"/api/users/{user.id}",
            headers={'Content-Type': 'application/json'},
            data=json.dumps(user_dict, cls=JSONEncoder)
        )

        # expect
        assert result.status_code == HTTPStatus.BAD_REQUEST
