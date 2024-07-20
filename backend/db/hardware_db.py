import uuid
from datetime import datetime
from typing import Type, Sequence
from uuid import UUID

from chalice import NotFoundError
from sqlalchemy import select

from models.models import Hardware
from util import util


def get_hardware(hardware_id: UUID) -> Type[Hardware]:
    session = util.get_db_session()

    hardware = session.get(Hardware, hardware_id)

    if hardware is None:
        raise NotFoundError(f"Hardware with id {hardware_id} not found")

    return hardware


def get_all_hardware() -> Sequence[Hardware]:
    session = util.get_db_session()

    stmt = select(Hardware)
    rows = session.exec(stmt)

    return rows.all()


def create_hardware(hardware: Hardware) -> Hardware:
    now = datetime.now()

    hardware.id = uuid.uuid4()
    hardware.created_at = now
    hardware.updated_at = now

    hardware.model_validate()

    session = util.get_db_session()

    session.add(hardware)
    session.commit()

    return hardware
