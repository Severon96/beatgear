import os
from typing import TypeVar

from pydantic import BaseModel
from sqlalchemy import Engine, create_engine, Connection

T = TypeVar('T', bound=BaseModel)


def parse_model_list(model: type[T], values: dict) -> list[T]:
    return [parse_model(model, value) for value in values]


def parse_model(model: type[T], values: dict) -> T:
    return model.model_validate(values)


def get_db_connection() -> Connection:
    engine = get_db_engine()

    return engine.connect()


def get_db_engine() -> Engine:
    host = os.environ.get("DB_HOST") if os.environ.get("DB_USER") is not None else "localhost"
    port = os.environ.get("DB_PORT") if os.environ.get("DB_PORT") is not None else "5432"
    dbname = os.environ.get("DB_NAME") if os.environ.get("DB_NAME") is not None else "hardware_management"
    user = os.environ.get("DB_USER") if os.environ.get("DB_USER") is not None else "postgres"
    password = os.environ.get("DB_PASS") if os.environ.get("DB_PASS") is not None else ""

    return create_engine(f"postgresql+psycopg2://{user}:{password}@{host}:{port}/{dbname}")
