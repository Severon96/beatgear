import {jwtDecode} from 'jwt-decode';

const oauthUrl = process.env.REACT_APP_OAUTH_ISSUER;
const realmName = process.env.REACT_APP_OAUTH_REALM;
const clientId = process.env.REACT_APP_OAUTH_CLIENT_ID;
const clientSecret = process.env.REACT_APP_OAUTH_CLIENT_SECRET;

export const isLoggedIn = async (): Promise<boolean> => {
    const accessToken = localStorage.getItem('access_token');

    if (!accessToken) return false;

    try {
        return await getTokenValidity(accessToken);
    } catch (error) {
        console.error('Error decoding token:', error);

        return false;
    }
};

async function getTokenValidity(accessToken: string) {
    const tokenIsValid = isAccessTokenValid(accessToken);

    if (!tokenIsValid) {
        const accessToken = await refreshAccessToken();

        return accessToken != null;
    }

    return tokenIsValid;
}

export const refreshAccessToken = async (): Promise<string | null> => {
    const refreshToken = localStorage.getItem('refresh_token');

    if (!refreshToken) {
        return null;
    }

    try {
        const response = await fetch(`${oauthUrl}/realms/${realmName}/protocol/openid-connect/token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                grant_type: 'refresh_token',
                client_id: `${clientId}`,
                client_secret: `${clientSecret}`,
                refresh_token: refreshToken,
            }),
        });

        const data = await response.json();

        if (response.ok) {
            const {access_token, refresh_token, id_token} = data;
            localStorage.set('access_token', access_token)
            localStorage.set('refresh_token', refresh_token)
            localStorage.set('id_token', id_token)

            return access_token;
        } else {
            console.error('Error renewing token:', data);
            return null;
        }
    } catch (error) {
        console.error('Network error:', error);
        return null;
    }
};

function isAccessTokenValid(accessToken: string) {
    const decodedToken: { exp: number } = jwtDecode(accessToken);
    const currentTime = Math.floor(Date.now() / 1000);

    return decodedToken.exp > currentTime;
}

export function getIdToken(): string|null {
    return localStorage.getItem('id_token');
}

export async function setAccessTokenByAuthorizationCode(authorizationCode: string | null): Promise<void> {
    if (!authorizationCode) {
        console.error("Authorization code not found")
    }

    console.log("authorization code", authorizationCode);

    try {
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

        if (response.ok) {
            const {access_token, refresh_token, id_token} = data;

            if (access_token && refresh_token && id_token) {
                localStorage.setItem('accessToken', access_token);
                localStorage.setItem('refreshToken', refresh_token);
                localStorage.setItem('idToken', id_token);
            }
        } else {
            console.error('Error when loading the tokens:', data);
        }
    } catch (error) {
        console.error('Network error:', error);
    }
}