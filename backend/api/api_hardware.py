from http import HTTPStatus
from uuid import UUID

from chalice import Blueprint, Response, BadRequestError
from pydantic_core import ValidationError

from api.constants import cors_config
from db import hardware_db
from models.models import Hardware
from util import util
from util.util import parse_model

api = Blueprint(__name__)


@api.route("/hardware", methods=['GET'], cors=cors_config)
def get_all_hardware():
    hardware = hardware_db.get_all_hardware()
    body = [hardware.model_dump(mode='json') for hardware in hardware]

    return Response(
        status_code=HTTPStatus.OK,
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
        body=hardware.model_dump_json()
    )


@api.route("/hardware", methods=['POST'], cors=cors_config)
def create_hardware():
    request = api.current_request
    try:
        json_body = request.json_body
        request_hardware = util.parse_model(Hardware, json_body)

        hardware_db.create_hardware(request_hardware)

        return Response(
            status_code=HTTPStatus.CREATED,
            headers={'Content-Type': 'application/json'},
            body=request_hardware.json()
        )
    except ValidationError as e:
        raise BadRequestError(str(e))
