from unittest.mock import patch

import dotenv
import pytest
import requests
from flask_jwt_extended import JWTManager
from sqlalchemy import create_engine
from sqlalchemy.orm import Session
from testcontainers.postgres import PostgresContainer

import app
from models.db_models import Base
from util.auth_util import fetch_public_key


@pytest.fixture(scope='function')
def postgres(request):
    with PostgresContainer("postgres:16-alpine") as postgres:
        db_url = postgres.get_connection_url()
        engine = create_engine(db_url, echo=True)
        Base.metadata.create_all(engine)
        patch_db_session = patch('util.util.get_db_session', return_value=Session(engine))
        patch_db_session.start()
        yield
        patch_db_session.stop()

@pytest.fixture(scope='function')
def flask_app():
    flask_app = app.create_app()

    dotenv_values = dotenv.dotenv_values('.env')
    flask_app.config.update(dotenv_values)

    flask_app.config['JWT_PUBLIC_KEY'] = fetch_public_key(
        flask_app.config.get('OAUTH_ISSUER'),
        flask_app.config.get('REALM_NAME')
    )

    JWTManager(flask_app)

    yield flask_app


@pytest.fixture(scope='function')
def client(flask_app):
    return flask_app.test_client()


@pytest.fixture(scope='function')
def jwt():
    dotenv_dict = dotenv.dotenv_values('.env')

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


@pytest.fixture(scope='function')
def jwt_admin():
    dotenv_dict = dotenv.dotenv_values('.env')

    realm_name = dotenv_dict.get('REALM_NAME')
    oauth_issuer = dotenv_dict.get('OAUTH_ISSUER')
    client_id = dotenv_dict.get('CLIENT_ID_ADMIN')
    client_secret = dotenv_dict.get('CLIENT_SECRET_ADMIN')

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
