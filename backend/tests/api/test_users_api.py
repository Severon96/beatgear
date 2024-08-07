import json
import unittest
import uuid
from datetime import datetime
from http import HTTPStatus
from unittest.mock import patch

from chalice.test import Client
from sqlalchemy import create_engine, MetaData
from sqlalchemy.orm import DeclarativeBase, Session

from app import app
from models.models import User, Base
from tests.util import util
from tests.util.db_util import create_user, setup_user
from util.util import parse_model, JSONEncoder


class TestUserApi(unittest.TestCase):
    def setUp(self):
        self.engine = create_engine("sqlite:///", echo=True)
        self.patch_db_session = patch('util.util.get_db_session', return_value=Session(self.engine))
        self.patch_db_session.start()

        Base.metadata.create_all(bind=self.engine)

    def tearDown(self):
        Base.metadata.drop_all(self.engine)

        self.patch_db_session.stop()

    def test_get_all_users_without_users(self):
        # then
        with Client(app) as client:
            result = client.http.get("/api/users")

            # expect
            assert result.status_code == HTTPStatus.OK
            assert len(result.json_body) == 0

    def test_get_all_users_with_users(self):
        # when
        create_user(setup_user())
        create_user(setup_user())

        # then
        with Client(app) as client:
            result = client.http.get("/api/users")

            # expect
            assert result.status_code == HTTPStatus.OK
            assert len(result.json_body) == 2

    def test_get_user_by_id(self):
        # when
        user = create_user(setup_user())

        # then
        with Client(app) as client:
            result = client.http.get(f"/api/users/{user.id}")

            # expect
            assert result.status_code == HTTPStatus.OK
            result_body = result.json_body
            assert result_body is not None
            api_user = User(**result_body)
            assert uuid.UUID(api_user.id) == user.id

    def test_get_missing_user_by_id(self):
        # then
        with Client(app) as client:
            result = client.http.get(f"/api/users/{uuid.uuid4()}")

            # expect
            assert result.status_code == HTTPStatus.NOT_FOUND

    def test_get_user_by_malformed_uuid(self):
        # then
        with Client(app) as client:
            result = client.http.get(f"/api/users/test")

            # expect
            assert result.status_code == HTTPStatus.BAD_REQUEST

    def test_create_user(self):
        # when
        user = setup_user()

        # then
        with Client(app) as client:
            result = client.http.post(
                "/api/users",
                headers={'Content-Type': 'application/json'},
                body=user.json()
            )

            # expect
            assert result.status_code == HTTPStatus.CREATED
            body = result.json_body
            api_user = User(**body)
            assert api_user.username == user.username

    def test_create_user_with_missing_username(self):
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
        with Client(app) as client:
            result = client.http.post(
                "/api/users",
                headers={'Content-Type': 'application/json'},
                body=json.dumps(user_dict, cls=JSONEncoder)
            )

            # expect
            assert result.status_code == HTTPStatus.BAD_REQUEST

    def test_update_user(self):
        # when
        user = create_user(setup_user())
        user.username = "updated_username"

        # then
        with Client(app) as client:
            result = client.http.patch(
                f"/api/users/{user.id}",
                headers={'Content-Type': 'application/json'},
                body=user.json()
            )

            # expect
            assert result.status_code == HTTPStatus.OK
            body = result.json_body
            api_user = User(**body)
            assert api_user.username == user.username

    def test_update_missing_user(self):
        # when
        user = setup_user()
        user.username = "updated_username"

        # then
        with Client(app) as client:
            result = client.http.patch(
                f"/api/users/{uuid.uuid4()}",
                headers={'Content-Type': 'application/json'},
                body=user.json()
            )

            # expect
            assert result.status_code == HTTPStatus.NOT_FOUND

    def test_update_user_with_missing_username(self):
        # when
        user = create_user(setup_user())
        user_dict = user.dict()
        user_dict['username'] = None

        # then
        with Client(app) as client:
            result = client.http.patch(
                f"/api/users/{user.id}",
                headers={'Content-Type': 'application/json'},
                body=json.dumps(user_dict, cls=JSONEncoder)
            )

            # expect
            assert result.status_code == HTTPStatus.BAD_REQUEST
