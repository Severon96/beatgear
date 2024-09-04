from os.path import join, dirname
from unittest.mock import patch

import dotenv
import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import Session
from testcontainers.postgres import PostgresContainer

from app import create_app
from auth import oauth
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
    dotenv_path = join(dirname(__file__), '.env.testing')
    dotenv.load_dotenv(dotenv_path)

    flask_app = create_app()
    flask_app.config.update({
        "TESTING": True,
    })

    yield flask_app


@pytest.fixture(scope='function')
def client(app):
    return app.test_client()


@pytest.fixture(scope='function')
def auth(app):
    auth = oauth.create_auth()
    auth.init_app(app)
    yield