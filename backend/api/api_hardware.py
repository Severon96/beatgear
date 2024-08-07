from http import HTTPStatus
from uuid import UUID

from chalice import Blueprint, Response, BadRequestError
from pydantic_core import ValidationError

from api.constants import cors_config
from db import hardware_db
from models.models import Hardware
from util import util

api = Blueprint(__name__)


@api.route("/hardware", methods=['GET'], cors=cors_config)
def get_all_hardware():
    all_hardware = hardware_db.get_all_hardware()
    body = []

    # I really don't know why this is necessary and this
    # database call doesn't work like e.g. get_all_users
    # but it is what it is
    for hardware in all_hardware:
        hardware_dict = hardware._asdict()
        hardware_model = Hardware.validate(hardware_dict['Hardware'])
        body.append(Hardware.json(hardware_model))

    return Response(
        status_code=HTTPStatus.OK,
        headers={'Content-Type': 'application/json'},
        body=body
    )


@api.route("/hardware/{hardware_id}", methods=['GET'], cors=cors_config)
def get_hardware(hardware_id: str):
    try:
        uuid = UUID(hardware_id)
    except ValueError:
        raise BadRequestError(f"{hardware_id} is not a valid id")
    hardware = hardware_db.get_hardware(uuid)

    return Response(
        status_code=HTTPStatus.OK,
        headers={'Content-Type': 'application/json'},
        body=hardware.json()
    )


@api.route("/hardware", methods=['POST'], cors=cors_config)
def create_hardware():
    request = api.current_request
    try:
        json_body = request.json_body
        request_hardware = Hardware(**json_body)

        hardware_db.create_hardware(request_hardware)

        return Response(
            status_code=HTTPStatus.CREATED,
            headers={'Content-Type': 'application/json'},
            body=request_hardware.json()
        )
    except ValidationError as e:
        raise BadRequestError(str(e))


@api.route("/hardware/{hardware_id}", methods=['PATCH'], cors=cors_config)
def update_user(hardware_id: str):
    try:
        hardware_uuid = UUID(hardware_id)
    except ValueError:
        raise BadRequestError(f"{hardware_id} is not a valid id")

    request = api.current_request
    try:
        json_body = request.json_body
        parsed_hardware = Hardware(**json_body)

        updated_user = hardware_db.update_hardware(hardware_uuid, parsed_hardware)

        return Response(
            status_code=HTTPStatus.OK,
            headers={'Content-Type': 'application/json'},
            body=updated_user.json()
        )
    except ValidationError as e:
        raise BadRequestError(str(e))
