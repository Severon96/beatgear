from http import HTTPStatus
from uuid import UUID

from chalice import Blueprint, Response, BadRequestError
from pydantic_core import ValidationError

from api.constants import cors_config
from db import users_db
from models.models import User
from util.util import parse_model

api = Blueprint(__name__)


@api.route("/users", methods=['GET'], cors=cors_config)
def get_all_users():
    users = users_db.get_all_users()
    body = [user.model_dump(mode="json") for user in users]

    return Response(
        status_code=HTTPStatus.OK,
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
        body=user.model_dump_json()
    )


@api.route("/users", methods=['POST'], cors=cors_config)
def create_user():
    request = api.current_request
    try:
        user: User = parse_model(User, request.json_body)
    except ValidationError as e:
        raise BadRequestError(str(e))

    users_db.create_user(user)

    return Response(
        status_code=HTTPStatus.OK,
        body=user.model_dump_json()
    )
