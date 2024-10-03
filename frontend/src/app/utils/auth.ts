import {jwtDecode} from 'jwt-decode';
import {cookies} from "next/headers";

const oauthUrl = process.env.OAUTH_ISSUER;
const realmName = process.env.OAUTH_REALM;
const clientId = process.env.OAUTH_CLIENT_ID;
const clientSecret = process.env.OAUTH_CLIENT_SECRET;

export const isLoggedIn = async (): Promise<boolean> => {
    const cookieStore = cookies();
    const accessToken = cookieStore.get('access_token')?.value;

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
    const cookieStore = cookies();
    const refreshToken = cookieStore.get('refresh_token')?.value;

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
            const {access_token, refresh_token} = data;
            cookies().set('access_token', access_token)
            cookies().set('refresh_token', refresh_token)

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