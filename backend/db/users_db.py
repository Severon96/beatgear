from uuid import UUID

from chalice import NotFoundError

from models.models import User
from util.util import parse_model, get_db_connection, close_db_connection, parse_model_list


def get_user(user_id: UUID) -> User:
    connection, cursor = get_db_connection()

    cursor.execute("SELECT * FROM users WHERE id=%s;", [str(user_id)])
    values = cursor.fetchone()

    if values is None:
        raise NotFoundError(f"user not found for id {user_id}")

    close_db_connection(connection, cursor)

    return parse_model(User, values)


def get_all_users() -> list[User]:
    connection, cursor = get_db_connection()

    cursor.execute("SELECT * FROM users;")
    values = cursor.fetchall()

    close_db_connection(connection, cursor)

    return parse_model_list(User, values)


def create_user(user: User) -> User:
    connection, cursor = get_db_connection()

    cursor.execute(
        "INSERT INTO users(id, title, room_id, start_time, end_time, recurring) VALUES (%s, %s, %s, %s, %s, %s)",
        (str(user.id), user.title, str(user.room_id), user.start_time, user.end_time,
         user.recurring))
    connection.commit()

    close_db_connection(connection, cursor)

    return user
