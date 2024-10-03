import React from "react";
import Image from "next/image";
import {metadata} from "@/app/layout";
import Link from "next/link";

export function Header() {
    const oauthUrl = process.env.OAUTH_ISSUER;
    const realmName = process.env.OAUTH_REALM;
    const clientId = process.env.OAUTH_CLIENT_ID;
    const redirectUri = process.env.OAUTH_REDIRECT_URI;

    return (
        <div
            className="w-full flex flex-col md:flex-row justify-between items-center pt-16 pb-2 md:pt-4 md:mt-0 border-b-2">
            <div className="flex items-center space-x-2">
                <Image
                    src="/images/logo.jpeg"
                    width={50}
                    height={50}
                    alt="BeatGear Logo"
                />
                <span className={"pr-2"}>{`${metadata.title}`}</span>
            </div>
            <div className="flex items-center space-x-2 mt-4 md:mt-0 md:ml-auto md:pr-2">
                <Link
                    href={`${oauthUrl}/realms/${realmName}/protocol/openid-connect/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=openid`}
                    className="button-secondary-blue py-1 px-3 rounded-lg"
                >
                    Anmelden
                </Link>
            </div>
        </div>
    );
}