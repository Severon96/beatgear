from http import HTTPStatus
from uuid import UUID

from flask import Blueprint, Response, abort
from pydantic_core import ValidationError


from db import users_db
from models.db_models import User

api = Blueprint('users', __name__)


@api.route("/users", methods=['GET'])
def get_all_users():
    users = users_db.get_all_users()
    body = [user.json() for user in users]

    return Response(
        status=HTTPStatus.OK,
        headers={'Content-Type': 'application/json'},
        response=body
    )


@api.route("/users/{user_id}", methods=['GET'])
def get_user(user_id: str):
    try:
        uuid = UUID(user_id)
    except ValueError:
        abort(400, f"{user_id} is not a valid id")
    user = users_db.get_user(uuid)

    return Response(
        status=HTTPStatus.OK,
        headers={'Content-Type': 'application/json'},
        response=user.json()
    )


@api.route("/users", methods=['POST'])
def create_user():
    request = api.current_request
    try:
        json_body = request.json_body
        request_user = User(**json_body)

        users_db.create_user(request_user)

        return Response(
            status=HTTPStatus.CREATED,
            headers={'Content-Type': 'application/json'},
            response=request_user.json()
        )
    except (ValidationError, ValueError) as e:
        abort(400, str(e))


@api.route("/users/{user_id}", methods=['PATCH'])
def update_user(user_id: str):
    try:
        user_uuid = UUID(user_id)
    except ValueError:
        abort(400, f"{user_id} is not a valid id")

    request = api.current_request
    try:
        json_body = request.json_body
        request_user = User(**json_body)

        updated_user = users_db.update_user(user_uuid, request_user)

        return Response(
            status=HTTPStatus.OK,
            headers={'Content-Type': 'application/json'},
            response=updated_user.json()
        )
    except (ValidationError, ValueError) as e:
        abort(400, str(e))
