import os
from typing import TypeVar

import dotenv
from pydantic import BaseModel
from sqlalchemy import Engine, create_engine, Connection
from sqlalchemy.orm import DeclarativeBase, Session

T = TypeVar('T', bound=BaseModel)


def parse_model_list(model: type[T], values: dict) -> list[T]:
    return [parse_model(model, value) for value in values]


def parse_model(model: type[T], values: dict) -> T:
    return model.model_validate(values)


def get_db_connection() -> Connection:
    engine = get_db_engine()

    return engine.connect()


def get_db_session() -> Session:
    engine = get_db_engine()

    return Session(engine)


def get_db_engine() -> Engine:
    engine = create_engine(os.environ.get("DB_URL"), echo=True)
    DeclarativeBase.metadata.create_all(engine)

    return engine
