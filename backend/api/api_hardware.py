from http import HTTPStatus
from uuid import UUID

from flask import Blueprint, Response, abort
from pydantic_core import ValidationError


from db import hardware_db
from models.db_models import Hardware

api = Blueprint('hardware', __name__)


@api.route("/hardware", methods=['GET'])
def get_all_hardware():
    all_hardware = hardware_db.get_all_hardware()
    body = [hardware.json() for hardware in all_hardware]

    return Response(
        status=HTTPStatus.OK,
        headers={'Content-Type': 'application/json'},
        response=body
    )


@api.route("/hardware/{hardware_id}", methods=['GET'])
def get_hardware(hardware_id: str):
    try:
        uuid = UUID(hardware_id)
    except ValueError:
        abort(400, f"{hardware_id} is not a valid id")
    hardware = hardware_db.get_hardware(uuid)

    return Response(
        status=HTTPStatus.OK,
        headers={'Content-Type': 'application/json'},
        response=hardware.json()
    )


@api.route("/hardware", methods=['POST'])
def create_hardware():
    request = api.current_request
    try:
        json_body = request.json_body
        request_hardware = Hardware(**json_body)

        hardware_db.create_hardware(request_hardware)

        return Response(
            status=HTTPStatus.CREATED,
            headers={'Content-Type': 'application/json'},
            response=request_hardware.json()
        )
    except (ValidationError, ValueError) as e:
        abort(400, str(e))


@api.route("/hardware/{hardware_id}", methods=['PATCH'])
def update_user(hardware_id: str):
    try:
        hardware_uuid = UUID(hardware_id)
    except ValueError:
        abort(400, f"{hardware_id} is not a valid id")

    request = api.current_request
    try:
        json_body = request.json_body
        parsed_hardware = Hardware(**json_body)

        updated_user = hardware_db.update_hardware(hardware_uuid, parsed_hardware)

        return Response(
            status=HTTPStatus.OK,
            headers={'Content-Type': 'application/json'},
            response=updated_user.json()
        )
    except (ValidationError, ValueError) as e:
        abort(400, str(e))
