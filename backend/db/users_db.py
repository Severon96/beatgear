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

    validated_model = user.model_validate(user)

    session = util.get_db_session()

    session.add(validated_model)
    session.commit()
    session.refresh(validated_model)

    return validated_model


def update_user(user_id: UUID, user: User) -> Type[User] | None:
    now = datetime.now()

    user.model_validate(user)

    session = util.get_db_session()

    db_user = session.get(User, user_id)

    if db_user is None:
        raise NotFoundError(f"User with id {user_id} not found.")

    db_user.updated_at = now

    db_user.sqlmodel_update(user)

    session.add(db_user)
    session.commit()
    session.refresh(db_user)

    return db_user
