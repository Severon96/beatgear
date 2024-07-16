import os
from typing import TypeVar

import psycopg2
from psycopg2._psycopg import cursor, connection
from pydantic import BaseModel

T = TypeVar('T', bound=BaseModel)


def parse_model_list(model: type[T], values: dict) -> list[T]:
    return [parse_model(model, value) for value in values]


def parse_model(model: type[T], values: dict) -> T:
    return model.model_validate(values)


def get_db_connection() -> (connection, cursor):
    db_connection = db_connect()
    db_cursor = get_cursor_from_connection(db_connection)

    return db_connection, db_cursor


def close_db_connection(db_connection: connection, db_cursor: cursor) -> None:
    db_connection.close()
    db_cursor.close()


def db_connect() -> connection:
    print(f"Db Data: {os.environ.get("DB_HOST")} {os.environ.get("DB_PORT")} {os.environ.get("")} {os.environ.get("DB_NAME")} {os.environ.get("DB_USER")} {os.environ.get("DB_PASS")}")
    return psycopg2.connect(host=os.environ.get("DB_HOST"), port=os.environ.get("DB_PORT"), dbname=os.environ.get("DB_NAME"),
                            user=os.environ.get("DB_USER"), password=os.environ.get("DB_PASS"))


def get_cursor_from_connection(connection: connection) -> cursor:
    return connection.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

