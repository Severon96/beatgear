from http import HTTPStatus
from uuid import UUID

from chalice import Blueprint, Response, BadRequestError, NotFoundError
from pydantic_core import ValidationError

from api.constants import cors_config
from db import users_db
from models.models import User
from util import util

api = Blueprint(__name__)


@api.route("/users", methods=['GET'], cors=cors_config)
def get_all_users():
    users = users_db.get_all_users()
    body = [user.json() for user in users]

    return Response(
        status_code=HTTPStatus.OK,
        headers={'Content-Type': 'application/json'},
        body=body
    )


@api.route("/users/{user_id}", methods=['GET'], cors=cors_config)
def get_user(user_id: str):
    try:
        uuid = UUID(user_id)
    except ValueError:
        raise BadRequestError(f"{user_id} is not a valid id")
    user = users_db.get_user(uuid)

    return Response(
        status_code=HTTPStatus.OK,
        headers={'Content-Type': 'application/json'},
        body=user.json()
    )


@api.route("/users", methods=['POST'], cors=cors_config)
def create_user():
    request = api.current_request
    try:
        json_body = request.json_body
        request_user = util.parse_model(User, json_body)

        users_db.create_user(request_user)

        return Response(
            status_code=HTTPStatus.CREATED,
            headers={'Content-Type': 'application/json'},
            body=request_user.json()
        )
    except ValidationError as e:
        raise BadRequestError(str(e))


@api.route("/users/{user_id}", methods=['PATCH'], cors=cors_config)
def update_user(user_id: str):
    try:
        user_uuid = UUID(user_id)
    except ValueError:
        raise BadRequestError(f"{user_id} is not a valid id")

    request = api.current_request
    try:
        json_body = request.json_body
        parsed_user = util.parse_model(User, json_body)

        updated_user = users_db.update_user(user_uuid, parsed_user)

        return Response(
            status_code=HTTPStatus.OK,
            headers={'Content-Type': 'application/json'},
            body=updated_user.json()
        )
    except ValidationError as e:
        raise BadRequestError(str(e))
