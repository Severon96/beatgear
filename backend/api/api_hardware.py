import json
from http import HTTPStatus
from uuid import UUID

from flask import Blueprint, Response, abort, request
from pydantic_core import ValidationError


from db import hardware_db
from models.db_models import Hardware, JSONEncoder
from util.auth_util import token_required

api = Blueprint('hardware', __name__)


@api.route("/hardware", methods=['GET'])
@token_required
def get_all_hardware():
    all_hardware = hardware_db.get_all_hardware()
    body = [hardware.dict() for hardware in all_hardware]
    body_json = json.dumps(body, cls=JSONEncoder)

    return Response(
        status=HTTPStatus.OK,
        content_type='application/json',
        response=body_json
    )


@api.route("/hardware/<hardware_id>", methods=['GET'])
@token_required
def get_hardware(hardware_id: str):
    try:
        uuid = UUID(hardware_id)
    except ValueError:
        abort(400, f"{hardware_id} is not a valid id")
    hardware = hardware_db.get_hardware(uuid)

    return Response(
        status=HTTPStatus.OK,
        content_type='application/json',
        response=hardware.json()
    )


@api.route("/hardware", methods=['POST'])
@token_required
def create_hardware():
    try:
        json_body = request.json
        request_hardware = Hardware(**json_body)

        hardware_db.create_hardware(request_hardware)

        return Response(
            status=HTTPStatus.CREATED,
            content_type='application/json',
            response=request_hardware.json()
        )
    except (ValidationError, ValueError) as e:
        abort(400, str(e))


@api.route("/hardware/<hardware_id>", methods=['PATCH'])
@token_required
def update_hardware(hardware_id: str):
    try:
        hardware_uuid = UUID(hardware_id)
    except ValueError:
        abort(400, f"{hardware_id} is not a valid id")

    try:
        json_body = request.json
        parsed_hardware = Hardware(**json_body)

        updated_user = hardware_db.update_hardware(hardware_uuid, parsed_hardware)

        return Response(
            status=HTTPStatus.OK,
            content_type='application/json',
            response=updated_user.json()
        )
    except (ValidationError, ValueError) as e:
        abort(400, str(e))
