import os

from dotenv import load_dotenv

load_dotenv()


class Config:
    JWT_ALGORITHM = 'RS256'
    REALM_NAME = os.environ.get('REALM_NAME')
    OAUTH_ISSUER = os.environ.get('OAUTH_ISSUER')
    CLIENT_ID = os.environ.get('CLIENT_ID')
    CLIENT_SECRET = os.environ.get('CLIENT_SECRET')
    OIDC_REDIRECT_URI = os.environ.get('REDIRECT_URI')
    PROVIDER_NAME = 'oauth_provider'
