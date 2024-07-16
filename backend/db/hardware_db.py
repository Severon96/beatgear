import uuid
from datetime import datetime
from typing import Type, Sequence
from uuid import UUID

from chalice import NotFoundError, BadRequestError
from sqlalchemy import select, insert
from sqlmodel.sql._expression_select_cls import _T

from models.models import Hardware
from util.util import get_db_connection, get_db_session


def get_hardware(hardware_id: UUID) -> Type[Hardware]:
    session = get_db_session()

    hardware = session.get(Hardware, hardware_id)

    if hardware is None:
        raise NotFoundError(f"Hardware with id {hardware_id} not found")

    return hardware


def get_all_hardware() -> Sequence[Hardware]:
    session = get_db_session()

    stmt = select(Hardware)
    rows = session.exec(stmt)

    return rows.all()


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
