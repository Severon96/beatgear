from unittest import TestCase

from chalice.test import Client
from app import app
from tests.util.db_util import setup_user


class TestUsersApi(TestCase):
    def test_get_all_users(self):
        # when
        user = setup_user()

        with Client(app, stage_name='dev') as client:
            result = client.http.get("/api/users")

            print(result.json_body)
