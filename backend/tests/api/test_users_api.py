from chalice.test import Client
from tests.util.fixtures import db

from app import app
from tests.util.db_util import create_user, setup_user


def test_get_all_users_without_users(db):
    # then
    with Client(app, stage_name='testing') as client:
        result = client.http.get("/api/users")

        # expect
        assert len(result.json_body) == 0


def test_get_all_users_without_users_2(db):
    # when
    create_user(setup_user())
    create_user(setup_user())

    # then
    with Client(app, stage_name='testing') as client:
        result = client.http.get("/api/users")

        # expect
        assert len(result.json_body) == 2
