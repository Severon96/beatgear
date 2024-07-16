from chalice.test import Client

from app import app
from tests.util.db_util import create_user, setup_user, clear_tables
from tests.util.fixtures import chalice_environment


def test_get_all_users_without_users(chalice_environment):
    # when
    clear_tables()

    # then
    with Client(app, stage_name='dev') as client:
        result = client.http.get("/api/users")

        # expect
        assert len(result.json_body) == 0


def test_get_all_users_without_users_2(chalice_environment):
    # when
    clear_tables()
    create_user(setup_user())

    # then
    with Client(app, stage_name='dev') as client:
        result = client.http.get("/api/users")

        # expect
        assert len(result.json_body) == 0
