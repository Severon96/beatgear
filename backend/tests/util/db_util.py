import uuid
from datetime import datetime

from db import users_db
from models.models import User


def setup_user() -> User:
    return User(
        id=uuid.uuid4(),
        username='testuser',
        first_name='Test',
        last_name='User',
        created_at=datetime.now(),
        updated_at=datetime.now()
    )


def create_user(user: User) -> User:
    return users_db.create_user(user)
