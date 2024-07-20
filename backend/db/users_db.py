import uuid
from datetime import datetime
from typing import Sequence, Type
from uuid import UUID

from chalice import NotFoundError
from sqlmodel import select

from models.models import User
from util import util


def get_user(user_id: UUID) -> Type[User]:
    session = util.get_db_session()

    user = session.get(User, user_id)

    if user is None:
        raise NotFoundError(f"User with id {user_id} not found")

    return user


def get_all_users() -> Sequence[User]:
    session = util.get_db_session()

    stmt = select(User)
    rows = session.exec(stmt)

    return rows.all()


def create_user(user: User) -> User:
    now = datetime.now()

    user.id = uuid.uuid4()
    user.created_at = now
    user.updated_at = now

    user.model_validate(user)

    session = util.get_db_session()

    session.add(user)
    session.commit()

    return user
