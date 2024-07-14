from uuid import UUID

from chalice import NotFoundError

from models.models import Hardware
from util.util import parse_model, get_db_connection, close_db_connection, parse_model_list


def get_hardware(hardware_id: UUID) -> Hardware:
    connection, cursor = get_db_connection()

    cursor.execute("SELECT * FROM hardware WHERE id=%s;", [str(hardware_id)])
    values = cursor.fetchone()

    if values is None:
        raise NotFoundError(f"hardware not found for id {hardware_id}")

    close_db_connection(connection, cursor)

    return parse_model(Hardware, values)


def get_all_hardware() -> list[Hardware]:
    connection, cursor = get_db_connection()

    cursor.execute("SELECT * FROM hardware;")
    values = cursor.fetchall()

    close_db_connection(connection, cursor)

    return parse_model_list(Hardware, values)


def create_hardware(hardware: Hardware) -> Hardware:
    connection, cursor = get_db_connection()

    cursor.execute(
        "INSERT INTO hardware(id, title, room_id, start_time, end_time, recurring) VALUES (%s, %s, %s, %s, %s, %s)",
        (str(hardware.id), hardware.title, str(hardware.room_id), hardware.start_time, hardware.end_time,
         hardware.recurring))
    connection.commit()

    close_db_connection(connection, cursor)

    return hardware
