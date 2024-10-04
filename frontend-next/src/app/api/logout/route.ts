import {NextResponse} from 'next/server';
import {NextRequest} from 'next/server';
import {serialize} from 'cookie';

export async function GET(request: NextRequest): Promise<NextResponse> {
    const responseHeaders = buildResponseHeaders();

    return NextResponse.redirect(new URL('/', request.url), {
        headers: responseHeaders,
    });
}

function buildResponseHeaders(): Headers {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1)

    const accessTokenCookie = serialize('access_token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        expires: yesterday,
    });

    const refreshTokenCookie = serialize('refresh_token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        expires: yesterday,
    });

    const idTokenCookie = serialize('id_token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        expires: yesterday,
    });

    const responseHeaders = new Headers();
    responseHeaders.append('Set-Cookie', accessTokenCookie);
    responseHeaders.append('Set-Cookie', refreshTokenCookie);
    responseHeaders.append('Set-Cookie', idTokenCookie);

    return responseHeaders;
}
