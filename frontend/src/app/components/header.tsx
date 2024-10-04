import React from "react";
import Image from "next/image";
import {metadata} from "@/app/layout";
import Link from "next/link";
import {getIdToken, isLoggedIn} from "@/app/utils/auth";

export async function Header() {
    const rootUrl = process.env.ROOT_URL;
    const oauthUrl = process.env.OAUTH_ISSUER;
    const realmName = process.env.OAUTH_REALM;
    const clientId = process.env.OAUTH_CLIENT_ID;
    const redirectPath = process.env.OAUTH_REDIRECT_PATH;

    const idToken = await getIdToken();

    return (
        <div
            className="w-full flex flex-col md:flex-row justify-between items-center py-1 md:mt-0 border-b-2 relative">
            <div className="flex items-center space-x-2 relative">
                <Image
                    src="/images/logo.jpeg"
                    width={50}
                    height={50}
                    alt="BeatGear Logo"
                />
                <span className={"pr-2"}>{`${metadata.title}`}</span>
            </div>
            <div className="flex items-center space-x-2 mt-4 md:mt-0 md:ml-auto md:pr-2 relative">
            {
                await isLoggedIn() ? (
                    <Link
                        href={`${oauthUrl}/realms/${realmName}/protocol/openid-connect/logout?id_token_hint=${idToken}&post_logout_redirect_uri=${rootUrl}/api/logout`}
                        className="button-secondary-blue py-1 px-3 rounded-lg"
                    >
                        Abmelden
                    </Link>
                    ) : (
                    <Link
                        href={`${oauthUrl}/realms/${realmName}/protocol/openid-connect/auth?client_id=${clientId}&redirect_uri=${rootUrl}${redirectPath}&response_type=code&scope=openid`}
                        className="button-secondary-blue py-1 px-3 rounded-lg"
                    >
                        Anmelden
                    </Link>
                )
            }
            </div>
        </div>
    );
}