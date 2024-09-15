import os
from typing import TypeVar

from pydantic import BaseModel
from sqlalchemy import Engine, create_engine
from sqlalchemy.orm import Session, scoped_session, sessionmaker

from models.db_models import Base

T = TypeVar('T', bound=BaseModel)


SessionLocal = scoped_session(sessionmaker(autocommit=False, autoflush=False, bind=None))

def parse_model_list(model: type[T], values: dict) -> list[T]:
    return [parse_model(model, value) for value in values]


def parse_model(model: type[T], values: dict) -> T:
    return model.model_validate(values)


def get_db_session() -> Session:
    return SessionLocal()


def setup_db_engine() -> Engine:
    engine = create_engine(os.environ.get("DB_URL"), echo=True)
    Base.metadata.create_all(engine)

    SessionLocal.configure(bind=engine)

    return engine
