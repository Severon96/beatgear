import uuid
from datetime import datetime

from db import users_db
from models.models import User
from util.util import get_db_connection, close_db_connection


def clear_tables():
    connection, cursor = get_db_connection()

    cursor.execute("DROP SCHEMA IF EXISTS public CASCADE;")
    cursor.execute("CREATE SCHEMA public;")
    cursor.execute("GRANT ALL ON SCHEMA public TO postgres;")
    cursor.execute("GRANT ALL ON SCHEMA public TO public;")
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
