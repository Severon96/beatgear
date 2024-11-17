import uuid
from datetime import datetime
from http import HTTPStatus
from typing import Type, Sequence
from uuid import UUID

from flask import abort, make_response, jsonify
from sqlalchemy import select, and_, or_, not_

from api.api_hardware import GetHardwareParams
from models.db_models import HardwareDb, BookingDb, booking_to_hardware_table
from models.models import Hardware
from util import util


def get_hardware(hardware_id: UUID) -> Type[HardwareDb]:
    session = util.get_db_session()

    hardware = session.get(HardwareDb, hardware_id)

    if hardware is None:
        abort(make_response(jsonify(message=f"Hardware with id {hardware_id} not found"), HTTPStatus.NOT_FOUND))

    return hardware


def get_hardware_by_ids(hardware_ids: list[UUID]) -> Sequence[HardwareDb]:
    session = util.get_db_session()

    stmt = select(HardwareDb).where(HardwareDb.id.in_(hardware_ids))
    hardware = session.scalars(stmt).all()

    if len(hardware) == 0:
        return []

    return hardware


def get_all_hardware() -> Sequence[HardwareDb]:
    session = util.get_db_session()

    stmt = select(HardwareDb)

    return session.scalars(stmt).all()


def get_available_hardware(user_id: UUID, params: GetHardwareParams) -> Sequence[HardwareDb]:
    session = util.get_db_session()

    conditions = []

    if params.booking_start and params.booking_end:
        conditions.append(
            and_(
                BookingDb.booking_start <= params.booking_end,
                BookingDb.booking_end >= params.booking_start
            )
        )
    elif params.booking_start:
        conditions.append(BookingDb.booking_end >= params.booking_start)
    elif params.booking_end:
        conditions.append(BookingDb.booking_start <= params.booking_end)

    if conditions:
        booked_hardware_ids_subquery = (
            select(booking_to_hardware_table.c.hardware_id)
            .join(BookingDb, BookingDb.id == booking_to_hardware_table.c.booking_id)
            .where(or_(*conditions))
            .subquery()
        )

        stmt = (
            select(HardwareDb)
            .where(
                not_(HardwareDb.id.in_(booked_hardware_ids_subquery)),
                HardwareDb.owner_id != user_id
            )
        )
    else:
        stmt = (
            select(HardwareDb)
            .where(HardwareDb.owner_id != user_id)
        )

    return session.scalars(stmt).all()


def create_hardware(hardware: Hardware) -> HardwareDb:
    db_hardware = HardwareDb(**hardware.model_dump())

    now = datetime.now()

    db_hardware.id = uuid.uuid4()
    db_hardware.owner_id = UUID(db_hardware.owner_id) if isinstance(db_hardware.owner_id, str) else db_hardware.owner_id
    db_hardware.created_at = now
    db_hardware.updated_at = now

    with util.get_db_session() as session:
        session.add(db_hardware)
        session.commit()
        session.refresh(db_hardware)

    return db_hardware


def update_hardware(hardware_id: UUID, hardware: Hardware) -> Type[HardwareDb]:
    db_hardware = HardwareDb(**hardware.model_dump())

    now = datetime.now()

    session = util.get_db_session()

    current_db_hardware = session.get(HardwareDb, hardware_id)

    if current_db_hardware is None:
        abort(make_response(jsonify(message=f"Hardware with id {hardware_id} not found"), HTTPStatus.NOT_FOUND))

    # field types might not be appropriate
    db_hardware.id = UUID(db_hardware.id) if isinstance(db_hardware.id, str) else db_hardware.id
    db_hardware.owner_id = UUID(db_hardware.owner_id) if isinstance(db_hardware.owner_id, str) else db_hardware.owner_id
    db_hardware.updated_at = now
    db_hardware.created_at = current_db_hardware.created_at

    session.merge(db_hardware)

    session.commit()
    session.refresh(current_db_hardware)

    return current_db_hardware
