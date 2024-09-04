import json

import requests
from jwt.algorithms import RSAAlgorithm


def fetch_public_key(oauth_issuer: str, realm_name: str) -> str:
    response = requests.get(f"{oauth_issuer}/realms/{realm_name}/.well-known/openid-configuration", verify=False)

    if response.status_code != 200: raise ValueError(f"Couldn't fetch openid configuration: {response.status_code}")

    oidc_config = response.json()

    oidc_jwks_uri = requests.get(oidc_config["jwks_uri"], verify=False).json()

    return RSAAlgorithm.from_jwk(
        json.dumps(oidc_jwks_uri["keys"][0])
    )