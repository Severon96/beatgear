import uuid
from datetime import datetime
from uuid import UUID

from chalice import NotFoundError, BadRequestError
from sqlalchemy import select, insert

from models.models import Hardware
from util.util import get_db_connection


def get_hardware(hardware_id: UUID) -> Hardware:
    connection = get_db_connection()

    statement = select(Hardware).where(Hardware.id == hardware_id)
    rows = connection.execute(statement).scalars()

    if rows.first() is None:
        raise NotFoundError(f"hardware not found for id {hardware_id}")

    return rows.first()


def get_all_hardware() -> list[Hardware]:
    connection = get_db_connection()

    statement = select(Hardware)
    rows = connection.execute(statement).scalars()

    return [row for row in rows]


def create_hardware(hardware: Hardware) -> Hardware:
    connection = get_db_connection()

    statement = insert(Hardware).values(
        id=uuid.uuid4(),
        name=hardware.name,
        serial=hardware.serial,
        image=hardware.image,
        category=hardware.category,
        owner_id=hardware.owner_id,
        created_at=datetime.now(),
        updated_at=datetime.now()
    ).returning(Hardware.id)
    statement.compile()

    rows = connection.execute(statement)

    inserted_row_id = rows.first()
    print(inserted_row_id)
    if inserted_row_id is None:
        raise BadRequestError("Error inserting new hardware")

    return None
