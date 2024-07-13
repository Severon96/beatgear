from chalice.test import Client
from app import app
from tests.util.db_util import setup_user


def test_get_all_users():
    # when
    user = setup_user()

    with Client(app) as client:
        result = client.http.get("/api/users")
