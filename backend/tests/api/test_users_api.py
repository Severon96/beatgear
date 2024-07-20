import unittest
from unittest.mock import patch

from chalice.test import Client
from sqlalchemy import create_engine
from sqlmodel import SQLModel, Session

from app import app
from tests.util.db_util import create_user, setup_user


class TestUserApi(unittest.TestCase):
    def setUp(self):
        self.engine = create_engine("sqlite:///", echo=True)
        self.patch_db_session = patch('util.util.get_db_session', return_value=Session(self.engine))
        self.mock = self.patch_db_session.start()

        SQLModel.metadata.create_all(self.engine)

    def tearDown(self):
        SQLModel.metadata.drop_all(self.engine)

        self.patch_db_session.stop()

    def test_get_all_users_without_users(self):
        # then
        with Client(app) as client:
            result = client.http.get("/api/users")

            # expect
            assert len(result.json_body) == 0

    def test_get_all_users_without_users_2(self):
        # when
        create_user(setup_user())
        create_user(setup_user())

        # then
        with Client(app) as client:
            result = client.http.get("/api/users")

            # expect
            assert len(result.json_body) == 2
            self.mock.assert_called()
