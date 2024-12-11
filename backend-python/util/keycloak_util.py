import os

import requests


def get_admin_token() -> str:
    url = f'{os.environ.get('OAUTH_ISSUER')}/realms/{os.environ.get('REALM_NAME')}/protocol/openid-connect/token'
    data = {
        'grant_type': 'password',
        'client_id': os.environ.get('CLIENT_ID'),
        'client_secret': os.environ.get('CLIENT_SECRET'),
        'username': os.environ.get('KEYCLOAK_ADMIN_USER'),
        'password': os.environ.get('KECYLOAK_ADMIN_PASSWORD')
    }
    response = requests.post(url, data=data)
    response.raise_for_status()
    return response.json()['access_token']

def get_user_by_id(user_id: str):
    admin_token = get_admin_token()

    url = f'{os.environ.get('OAUTH_ISSUER')}/admin/realms/{os.environ.get('REALM_NAME')}/users/{user_id}'
    headers = {'Authorization': f'Bearer {admin_token}'}

    response = requests.get(url, headers=headers)

    response.raise_for_status()

    return response.json()