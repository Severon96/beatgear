import os
from os.path import join, dirname
from unittest.mock import patch

import dotenv
import pytest
import requests
from sqlalchemy import create_engine
from sqlalchemy.orm import Session
from testcontainers.postgres import PostgresContainer

from app import create_app
from models.db_models import Base


@pytest.fixture(scope='function')
def postgres(request):
    with PostgresContainer("postgres:16") as postgres:
        db_url = postgres.get_connection_url()
        engine = create_engine(db_url, echo=True)
        Base.metadata.create_all(engine)
        patch_db_session = patch('util.util.get_db_session', return_value=Session(engine))
        patch_db_session.start()
        yield
        patch_db_session.stop()

@pytest.fixture(scope='function')
def app():
    flask_app = create_app()
    flask_app.config.update({
        "TESTING": True,
    })

    yield flask_app


@pytest.fixture(scope='function')
def client(app):
    return app.test_client()


@pytest.fixture(scope='function')
def jwt():
    dotenv_dict = dotenv.dotenv_values('.env.testing')

    realm_name = dotenv_dict.get('REALM_NAME')
    oauth_issuer = dotenv_dict.get('OAUTH_ISSUER')
    client_id = dotenv_dict.get('CLIENT_ID')
    client_secret = dotenv_dict.get('CLIENT_SECRET')

    data = {
        'grant_type': 'client_credentials',
        'client_id': client_id,
        'client_secret': client_secret,
    }

    request_uri = f"{oauth_issuer}/realms/{realm_name}/protocol/openid-connect/token"

    response = requests.post(request_uri, data=data)

    if response.status_code == 200:
        token = response.json().get('access_token')

        yield token
    else:
        print(response.text)
        raise ValueError(f"Error when fetching jwt token: {response.status_code}")
