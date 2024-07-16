import uuid
from datetime import datetime

from db import users_db
from models.models import User
from util.util import get_db_connection, close_db_connection


def clear_tables():
    connection, cursor = get_db_connection()

    cursor.execute("TRUNCATE bookings CASCADE;")
    cursor.execute("TRUNCATE users CASCADE;")
    cursor.execute("TRUNCATE hardware CASCADE;")
    connection.commit()

    close_db_connection(connection, cursor)


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
