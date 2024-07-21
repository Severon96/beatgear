import unittest
import uuid
from http import HTTPStatus
from unittest.mock import patch

from chalice.test import Client
from sqlalchemy import create_engine
from sqlmodel import SQLModel, Session

from app import app
from models.models import User
from tests.util import util
from tests.util.db_util import create_hardware, setup_hardware
from util.util import parse_model


class TestUserApi(unittest.TestCase):
    def setUp(self):
        self.engine = create_engine("sqlite:///", echo=True)
        self.patch_db_session = patch('util.util.get_db_session', return_value=Session(self.engine))
        self.patch_db_session.start()

        SQLModel.metadata.create_all(self.engine)

    def tearDown(self):
        SQLModel.metadata.drop_all(self.engine)

        self.patch_db_session.stop()

    def test_get_all_hardware_without_hardware(self):
        # then
        with Client(app) as client:
            result = client.http.get("/api/hardware")

            # expect
            assert result.status_code == HTTPStatus.OK
            assert len(result.json_body) == 0

    def test_get_all_hardware_with_hardware(self):
        # when
        create_hardware(setup_hardware())
        create_hardware(setup_hardware())

        # then
        with Client(app) as client:
            result = client.http.get("/api/hardware")

            # expect
            assert result.status_code == HTTPStatus.OK
            assert len(result.json_body) == 2

    def test_get_hardware_by_id(self):
        # when
        hardware = create_hardware(setup_hardware())

        # then
        with Client(app) as client:
            result = client.http.get(f"/api/hardware/{hardware.id}")

            # expect
            assert result.status_code == HTTPStatus.OK
            assert result.body is not None
            api_hardware = parse_model(User, util.body_to_dict(result.body))
            assert api_hardware.id == hardware.id

    def test_get_missing_hardware_by_id(self):
        # then
        with Client(app) as client:
            result = client.http.get(f"/api/hardware/{uuid.uuid4()}")

            # expect
            assert result.status_code == HTTPStatus.NOT_FOUND

    def test_get_hardware_by_malformed_uuid(self):
        # then
        with Client(app) as client:
            result = client.http.get(f"/api/hardware/test")

            # expect
            assert result.status_code == HTTPStatus.BAD_REQUEST

    def test_create_hardware(self):
        # when
        hardware = setup_hardware()

        # then
        with Client(app) as client:
            result = client.http.post(
                "/api/hardware",
                headers={'Content-Type': 'application/json'},
                body=hardware.json()
            )

            # expect
            assert result.status_code == HTTPStatus.CREATED
            body = result.json_body
            api_hardware = parse_model(User, body)
            assert api_hardware.hardwarename == hardware.hardwarename

    def test_create_hardware_with_missing_hardware_name(self):
        # when
        hardware = setup_hardware()
        hardware.name = None

        # then
        with Client(app) as client:
            result = client.http.post(
                "/api/hardware",
                headers={'Content-Type': 'application/json'},
                body=hardware.json()
            )

            # expect
            assert result.status_code == HTTPStatus.BAD_REQUEST

    def test_update_hardware(self):
        # when
        hardware = create_hardware(setup_hardware())
        hardware.name = "updated_hardware_name"

        # then
        with Client(app) as client:
            result = client.http.patch(
                f"/api/hardware/{hardware.id}",
                headers={'Content-Type': 'application/json'},
                body=hardware.json()
            )

            # expect
            assert result.status_code == HTTPStatus.OK
            body = result.json_body
            api_hardware = parse_model(User, body)
            assert api_hardware.hardwarename == hardware.hardwarename

    def test_update_missing_hardware(self):
        # when
        hardware = setup_hardware()
        hardware.name = "updated_hardware_name"

        # then
        with Client(app) as client:
            result = client.http.patch(
                f"/api/hardware/{uuid.uuid4()}",
                headers={'Content-Type': 'application/json'},
                body=hardware.json()
            )

            # expect
            assert result.status_code == HTTPStatus.NOT_FOUND

    def test_update_hardware_with_missing_hardware_name(self):
        # when
        hardware = create_hardware(setup_hardware())
        hardware.name = None

        # then
        with Client(app) as client:
            result = client.http.patch(
                f"/api/hardware/{hardware.id}",
                headers={'Content-Type': 'application/json'},
                body=hardware.json()
            )

            # expect
            assert result.status_code == HTTPStatus.BAD_REQUEST
