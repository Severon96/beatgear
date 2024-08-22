from unittest.mock import patch

import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import Session
from testcontainers.postgres import PostgresContainer

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

