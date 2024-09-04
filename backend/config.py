import json
import os

import requests
from dotenv import load_dotenv
from jwt.algorithms import RSAAlgorithm

load_dotenv()


def fetch_public_key(oauth_issuer: str, realm_name: str) -> str:
    response = requests.get(f"{oauth_issuer}/realms/{realm_name}/.well-known/openid-configuration", verify=False)

    if response.status_code != 200: raise ValueError(f"Couldn't fetch openid configuration: {response.status_code}")
    print(f"response text: {response.text}")
    oidc_config = response.json()

    oidc_jwks_uri = requests.get(oidc_config["jwks_uri"], verify=False).json()

    return RSAAlgorithm.from_jwk(
        json.dumps(oidc_jwks_uri["keys"][0])
    )


class Config:
    JWT_ALGORITHM = 'RS256'
    REALM_NAME = os.environ.get('REALM_NAME')
    OAUTH_ISSUER = os.environ.get('OAUTH_ISSUER')
    CLIENT_ID = os.environ.get('CLIENT_ID')
    CLIENT_SECRET = os.environ.get('CLIENT_SECRET')
    OIDC_REDIRECT_URI = os.environ.get('REDIRECT_URI')
    PROVIDER_NAME = 'oauth_provider'
    JWT_PUBLIC_KEY = fetch_public_key(OAUTH_ISSUER, REALM_NAME)
