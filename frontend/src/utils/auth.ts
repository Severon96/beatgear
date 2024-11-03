import {jwtDecode} from 'jwt-decode';

export type Tokens = {
    accessToken: string
    refreshToken: string
    idToken: string
}

export const isLoggedIn = (accessToken: string | null | undefined): boolean => {
    if (!accessToken) return false;

    try {
        return isAccessTokenValid(accessToken);
    } catch (error) {
        console.error('Error decoding token:', error);

        return false;
    }
};

function isAccessTokenValid(accessToken: string) {
    const decodedToken: { exp: number } = jwtDecode(accessToken);
    const currentTime = Math.floor(Date.now() / 1000);

    return decodedToken.exp > currentTime;
}

export async function getAccessTokenByAuthorizationCode(authorizationCode: string | null): Promise<Tokens> {
    if (!authorizationCode) {
        console.error("Authorization code not found")
    }

    const rootUrl = process.env.REACT_APP_ROOT_URL;
    const oauthUrl = process.env.REACT_APP_OAUTH_ISSUER;
    const realmName = process.env.REACT_APP_OAUTH_REALM;
    const clientId = process.env.REACT_APP_OAUTH_CLIENT_ID;
    const clientSecret = process.env.REACT_APP_OAUTH_CLIENT_SECRET;
    const redirectPath = process.env.REACT_APP_OAUTH_REDIRECT_PATH;

    const response = await fetch(`${oauthUrl}/realms/${realmName}/protocol/openid-connect/token`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            grant_type: 'authorization_code',
            client_id: `${clientId}`,
            client_secret: `${clientSecret}`,
            code: authorizationCode ?? '',
            redirect_uri: `${rootUrl}${redirectPath}`
        }),
    });

    const data = await response.json();

    if (!response.ok) {
        console.error('Error when loading the tokens:', data);
        throw Error("Error when fulfilling login")
    }

    const {access_token, refresh_token, id_token} = data;

    if (access_token && refresh_token && id_token) {
        return {
            accessToken: access_token,
            refreshToken: refresh_token,
            idToken: id_token
        }
    }

    throw Error("Error when fulfilling login")
}