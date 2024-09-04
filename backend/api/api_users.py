import json
from http import HTTPStatus
from uuid import UUID

import flask
from flask import Blueprint, Response, abort, request
from flask_jwt_extended import jwt_required
from pydantic_core import ValidationError

from db import users_db
from models.db_models import User, JSONEncoder

api = Blueprint('users', __name__)


@api.route("/users", methods=['GET'])
@jwt_required()
def get_all_users():
    users = users_db.get_all_users()
    body = [user.dict() for user in users]
    body_json = json.dumps(body, cls=JSONEncoder)

    return Response(
        status=HTTPStatus.OK,
        content_type='application/json',
        response=body_json
    )


@api.route("/users/<user_id>", methods=['GET'])
@jwt_required()
def get_user(user_id: str):
    try:
        uuid = UUID(user_id)
    except ValueError:
        abort(400, f"{user_id} is not a valid id")
    user = users_db.get_user(uuid)

    return Response(
        status=HTTPStatus.OK,
        content_type='application/json',
        response=user.json()
    )


@api.route("/users", methods=['POST'])
@jwt_required()
def create_user():
    try:
        json_body = request.json
        request_user = User(**json_body)

        users_db.create_user(request_user)

        return Response(
            status=HTTPStatus.CREATED,
            content_type='application/json',
            response=request_user.json()
        )
    except (ValidationError, ValueError) as e:
        abort(400, str(e))


@api.route("/users/<user_id>", methods=['PATCH'])
@jwt_required()
def update_user(user_id: str):
    try:
        user_uuid = UUID(user_id)
    except ValueError:
        abort(400, f"{user_id} is not a valid id")

    try:
        json_body = request.json
        request_user = User(**json_body)

        updated_user = users_db.update_user(user_uuid, request_user)

        return Response(
            status=HTTPStatus.OK,
            content_type='application/json',
            response=updated_user.json()
        )
    except (ValidationError, ValueError) as e:
        abort(400, str(e))
