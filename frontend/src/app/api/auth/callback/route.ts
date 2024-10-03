import {NextResponse} from 'next/server';
import {NextRequest} from 'next/server';

export async function GET(request: NextRequest) {
    const {searchParams} = new URL(request.url);
    const code = searchParams.get('code');

    if (!code) {
        return NextResponse.json({error: 'Authorization code not found'}, {status: 400});
    }

    try {
        const oauthUrl = process.env.OAUTH_ISSUER;
        const realmName = process.env.OAUTH_REALM;
        const clientId = process.env.OAUTH_CLIENT_ID;
        const clientSecret = process.env.OAUTH_CLIENT_SECRET;
        const redirectUri = process.env.OAUTH_REDIRECT_URI;

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
                redirect_uri: `${redirectUri}`
            }),
        });

        const data = await response.json();

        if (response.ok) {
            const {access_token, refresh_token} = data;

            localStorage.setItem('access_token', access_token);
            localStorage.setItem('refresh_token', refresh_token);

            return NextResponse.redirect(new URL('/', request.url));
        } else {
            console.error('Fehler beim Abrufen der Tokens:', data);
            return NextResponse.json({error: data.error}, {status: 400});
        }
    } catch (error) {
        console.error('Netzwerkfehler:', error);
        return NextResponse.json({error: 'Network error'}, {status: 500});
    }
}
