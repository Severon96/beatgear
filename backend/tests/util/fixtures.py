import pytest
from mockito import when2, when
from sqlalchemy import create_engine
from sqlmodel import SQLModel, Session

from util import util
from util.util import get_db_session, get_db_connection


@pytest.fixture
def db():
    engine = create_engine("sqlite://", echo=True)

    SQLModel.metadata.create_all(engine)

    when(util).get_db_session().thenReturn(Session(engine))
