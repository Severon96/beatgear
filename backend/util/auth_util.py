import json
from functools import wraps

import requests
from flask_jwt_extended import verify_jwt_in_request, get_jwt
from jwt.algorithms import RSAAlgorithm

from db import users_db
from models.request_models import AuthenticatedUser


def fetch_public_key(oauth_issuer: str, realm_name: str) -> str:
    response = requests.get(f"{oauth_issuer}/realms/{realm_name}/.well-known/openid-configuration", verify=False)

    if response.status_code != 200: raise ValueError(f"Couldn't fetch openid configuration: {response.status_code}")

    oidc_config = response.json()

    oidc_jwks_uri = requests.get(oidc_config["jwks_uri"], verify=False).json()

    return RSAAlgorithm.from_jwk(
        json.dumps(oidc_jwks_uri["keys"][0])
    )


def token_required(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        roles = []
        verify_jwt_in_request()
        jwt = get_jwt()
        print("user claims", jwt)
        print("user roles", roles)
        return fn(roles, *args, **kwargs)

    return wrapper
