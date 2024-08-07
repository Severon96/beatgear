import uuid
from datetime import datetime
from typing import Type, Sequence
from uuid import UUID

from chalice import NotFoundError
from sqlalchemy import select
from sqlalchemy.engine import TupleResult
from sqlmodel.sql._expression_select_cls import _T

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

    validated_model = hardware.model_validate(hardware)

    with util.get_db_session() as session:
        print('validated hardware model', validated_model)
        session.add(validated_model)
        session.commit()
        session.refresh(validated_model)

    return validated_model


def update_hardware(hardware_id: UUID, hardware: Hardware) -> Type[Hardware] | None:
    now = datetime.now()

    hardware.model_validate(hardware)

    session = util.get_db_session()

    db_hardware = session.get(Hardware, hardware_id)

    if db_hardware is None:
        raise NotFoundError(f"Hardware with id {hardware_id} not found.")

    db_hardware.updated_at = now

    db_hardware.sqlmodel_update(hardware)

    session.add(db_hardware)
    session.commit()
    session.refresh(db_hardware)

    return db_hardware
