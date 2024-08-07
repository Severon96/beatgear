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
    return session.scalars(stmt).all()


def create_hardware(hardware: Hardware) -> Hardware:
    now = datetime.now()

    hardware.id = uuid.uuid4()
    hardware.owner_id = UUID(hardware.owner_id) if isinstance(hardware.owner_id, str) else hardware.owner_id
    hardware.created_at = now
    hardware.updated_at = now

    with util.get_db_session() as session:
        session.add(hardware)
        session.commit()
        session.refresh(hardware)

    return hardware


def update_hardware(hardware_id: UUID, hardware: Hardware) -> Type[Hardware] | None:
    now = datetime.now()

    session = util.get_db_session()

    db_hardware = session.get(Hardware, hardware_id)

    if db_hardware is None:
        raise NotFoundError(f"Hardware with id {hardware_id} not found.")

    # field types might not be appropriate
    hardware.id = UUID(hardware.id) if isinstance(hardware.id, str) else hardware.id
    hardware.owner_id = UUID(hardware.owner_id) if isinstance(hardware.owner_id, str) else hardware.owner_id
    hardware.updated_at = now
    hardware.created_at = db_hardware.created_at

    session.merge(hardware)

    session.commit()
    session.refresh(db_hardware)

    return db_hardware
