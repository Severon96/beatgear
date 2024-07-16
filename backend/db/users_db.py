import uuid
from datetime import datetime
from uuid import UUID

from chalice import NotFoundError, BadRequestError
from sqlalchemy import select, insert

from models.models import User
from util.util import parse_model, get_db_connection, close_db_connection, parse_model_list


def get_user(user_id: UUID) -> User:
    connection = get_db_connection()

    statement = select(User).where(User.id == user_id)
    rows = connection.execute(statement).scalars()

    if rows.first() is None:
        raise NotFoundError(f"user not found for id {user_id}")

    return rows.first()


def get_all_users() -> list[User]:
    connection = get_db_connection()

    statement = select(User)
    rows = connection.execute(statement).scalars()

    return [row for row in rows]


def create_user(user: User) -> User:
    connection = get_db_connection()

    statement = insert(User).values(
        id=uuid.uuid4(),
        username=user.username,
        first_name=user.first_name,
        last_name=user.last_name,
        created_at=datetime.now(),
        updated_at=datetime.now()
    ).returning(User.id)
    statement.compile()

    rows = connection.execute(statement)

    inserted_row_id = rows.first()
    print(inserted_row_id)
    if inserted_row_id is None:
        raise BadRequestError("Error inserting new user")

    return None
