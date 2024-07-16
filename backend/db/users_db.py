import uuid
from datetime import datetime
from typing import Sequence, Type
from uuid import UUID

from chalice import NotFoundError, BadRequestError
from sqlalchemy import insert
from sqlmodel import select

from models.models import User
from util.util import get_db_connection, get_db_session


def get_user(user_id: UUID) -> Type[User]:
    session = get_db_session()

    user = session.get(User, user_id)

    if user is None:
        raise NotFoundError(f"User with id {user_id} not found")

    return user


def get_all_users() -> Sequence[User]:
    session = get_db_session()

    stmt = select(User)
    rows = session.exec(stmt)

    return rows.all()


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
