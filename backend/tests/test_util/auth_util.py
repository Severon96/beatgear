import dotenv
import jwt

from util.auth_util import fetch_public_key


def get_user_id_from_jwt(jwt_token: str) -> str:
    dotenv_dict = dotenv.dotenv_values('.env.testing')
    realm_name = dotenv_dict.get('REALM_NAME')
    oauth_issuer = dotenv_dict.get('OAUTH_ISSUER')

    public_key = fetch_public_key(oauth_issuer, realm_name)

    decoded = jwt.decode(jwt_token, public_key, algorithms=["RS256"], audience="account")

    return decoded['sub']