from flask_pyoidc import OIDCAuthentication
from flask_pyoidc.provider_configuration import ProviderConfiguration, ClientMetadata

import config

OAUTH_ISSUER=config.Config.OAUTH_ISSUER
CLIENT_ID=config.Config.CLIENT_ID
CLIENT_SECRET=config.Config.CLIENT_SECRET
PROVIDER_NAME=config.Config.PROVIDER_NAME

def create_auth() -> OIDCAuthentication:
    provider_config = ProviderConfiguration(issuer=OAUTH_ISSUER,
                                             client_metadata=ClientMetadata(CLIENT_ID, CLIENT_SECRET))

    return OIDCAuthentication({PROVIDER_NAME: provider_config})

auth = create_auth()