import {NextResponse} from 'next/server';
import {NextRequest} from 'next/server';
import { serialize } from 'cookie';

export async function GET(request: NextRequest): Promise<NextResponse> {
    const {searchParams} = new URL(request.url);
    const code = searchParams.get('code');

    if (!code) {
        return NextResponse.json({error: 'Authorization code not found'}, {status: 400});
    }

    try {
        const rootUrl = process.env.ROOT_URL;
        const oauthUrl = process.env.OAUTH_ISSUER;
        const realmName = process.env.OAUTH_REALM;
        const clientId = process.env.OAUTH_CLIENT_ID;
        const clientSecret = process.env.OAUTH_CLIENT_SECRET;
        const redirectPath = process.env.OAUTH_REDIRECT_PATH;

        const response = await fetch(`${oauthUrl}/realms/${realmName}/protocol/openid-connect/token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                grant_type: 'authorization_code',
                client_id: `${clientId}`,
                client_secret: `${clientSecret}`,
                code: code,
                redirect_uri: `${rootUrl}${redirectPath}`
            }),
        });

        const data = await response.json();

        if (response.ok) {
            const {access_token, refresh_token, id_token} = data;

            const responseHeaders = buildResponseHeaders(access_token, refresh_token, id_token);

            return NextResponse.redirect(new URL('/', request.url), {
                headers: responseHeaders,
            });
        } else {
            console.error('Fehler beim Abrufen der Tokens:', data);
            return NextResponse.json({error: data.error}, {status: 400});
        }
    } catch (error) {
        console.error('Netzwerkfehler:', error);
        return NextResponse.json({error: 'Network error'}, {status: 500});
    }
}

function buildResponseHeaders(access_token: string, refresh_token: string, id_token: string): Headers {
    const accessTokenCookie = serialize('access_token', access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 60 * 60,
    });

    const refreshTokenCookie = serialize('refresh_token', refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 60 * 60 * 24 * 30,
    });

    const idTokenCookie = serialize('id_token', id_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 60 * 60 * 24 * 30,
    });

    const responseHeaders = new Headers();
    responseHeaders.append('Set-Cookie', accessTokenCookie);
    responseHeaders.append('Set-Cookie', refreshTokenCookie);
    responseHeaders.append('Set-Cookie', idTokenCookie);

    return responseHeaders;
}
