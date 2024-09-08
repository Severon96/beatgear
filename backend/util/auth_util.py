import json
import os
from functools import wraps
from uuid import UUID

import requests
from dotenv import dotenv_values
from flask import jsonify
from flask_jwt_extended import verify_jwt_in_request, get_jwt
from jwt.algorithms import RSAAlgorithm

from models.request_models import AuthenticatedUser


def fetch_public_key(oauth_issuer: str, realm_name: str) -> str:
    response = requests.get(f"{oauth_issuer}/realms/{realm_name}/.well-known/openid-configuration", verify=False)

    if response.status_code != 200:
        print(f"failed fetching public key: {response.status_code}", response.text)
        raise ValueError(f"Couldn't fetch openid configuration: {response.status_code}")

    oidc_config = response.json()

    oidc_jwks_uri = requests.get(oidc_config["jwks_uri"], verify=False).json()

    return RSAAlgorithm.from_jwk(
        json.dumps(oidc_jwks_uri["keys"][0])
    )


def token_required(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        verify_jwt_in_request()
        return fn(*args, **kwargs)

    return wrapper


def is_author_or_admin(authenticated_user: AuthenticatedUser, author_id: UUID) -> bool:
    admin_role = dotenv_values().get('ADMIN_ROLE_NAME')
    print('admin role name: ', admin_role)

    if admin_role in authenticated_user.roles:
        return True

    return author_id == authenticated_user.id


def user(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        verify_jwt_in_request()
        jwt = get_jwt()

        if jwt is None:
            return jsonify('Access denied'), 401

        user_id = jwt['sub']
        username = jwt['preferred_username']
        roles = jwt['realm_access']['roles']

        return fn(AuthenticatedUser(
            id=UUID(user_id),
            username=username,
            roles=roles,
        ), *args, **kwargs)

    return wrapper
