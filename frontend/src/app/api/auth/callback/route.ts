import {NextResponse} from 'next/server';
import {NextRequest} from 'next/server';

export async function POST(request: NextRequest) {
    const {searchParams} = new URL(request.url);
    const code = searchParams.get('code');

    console.log("Test ob hier irgendwas laeuft.");

    if (!code) {
        return NextResponse.json({error: 'Authorization code not found'}, {status: 400});
    }

    try {
        const oauthUrl = process.env.OAUTH_ISSUER;
        const realmName = process.env.OAUTH_REALM;
        const clientId = process.env.OAUTH_CLIENT_ID;
        const clientSecret = process.env.OAUTH_CLIENT_SECRET;
        const redirectUri = process.env.OAUTH_REDIRECT_URI;

        const response = await fetch(`https://${oauthUrl}/auth/realms/${realmName}/protocol/openid-connect/token`, {
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
            // Tokens erfolgreich erhalten
            const {access_token, refresh_token} = data;

            // Tokens im localStorage oder in einem globalen Zustand speichern
            // Hinweis: localStorage ist nicht in server-seitigen Routen verfügbar.
            // Du solltest die Tokens in einem globalen Zustand oder in einem Cookie speichern.

            return NextResponse.json({access_token, refresh_token}, {status: 200});
        } else {
            console.error('Fehler beim Abrufen der Tokens:', data);
            return NextResponse.json({error: data.error}, {status: 400});
        }
    } catch (error) {
        console.error('Netzwerkfehler:', error);
        return NextResponse.json({error: 'Network error'}, {status: 500});
    }
}
