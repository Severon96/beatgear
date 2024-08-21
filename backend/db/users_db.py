import uuid
from datetime import datetime
from typing import Sequence, Type
from uuid import UUID

from chalice import NotFoundError
from sqlalchemy import select

from models.db_models import User
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
    return session.scalars(stmt).all()


def create_user(user: User) -> User:
    now = datetime.now()

    user.id = uuid.uuid4()
    user.created_at = now
    user.updated_at = now

    session = util.get_db_session()

    session.add(user)
    session.commit()
    session.refresh(user)

    return user


def update_user(user_id: UUID, user: User) -> Type[User] | None:
    now = datetime.now()

    session = util.get_db_session()

    db_user = session.get(User, user_id)

    if db_user is None:
        raise NotFoundError(f"User with id {user_id} not found.")

    # field types might not be appropriate
    user.id = db_user.id
    user.created_at = db_user.created_at
    user.updated_at = now

    session.merge(user)
    session.commit()
    session.refresh(db_user)

    return db_user
