import os

from flask_pyoidc import OIDCAuthentication
from flask_pyoidc.provider_configuration import ProviderConfiguration, ClientMetadata

OAUTH_ISSUER = os.environ.get('OAUTH_ISSUER')
CLIENT_ID = os.environ.get('CLIENT_ID')
CLIENT_SECRET = os.environ.get('CLIENT_SECRET')
PROVIDER_NAME = 'oauth_provider'

def create_auth() -> OIDCAuthentication:
    provider_config = ProviderConfiguration(issuer=OAUTH_ISSUER,
                                             client_metadata=ClientMetadata(CLIENT_ID, CLIENT_SECRET))

    return OIDCAuthentication({PROVIDER_NAME: provider_config})

auth = create_auth()