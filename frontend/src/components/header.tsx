import React, {useEffect, useState} from "react";
import {getIdToken, isLoggedIn} from "../utils/auth";

export function Header() {
    const rootUrl = process.env.REACT_APP_ROOT_URL;
    const oauthUrl = process.env.REACT_APP_OAUTH_ISSUER;
    const realmName = process.env.REACT_APP_OAUTH_REALM;
    const clientId = process.env.REACT_APP_OAUTH_CLIENT_ID;
    const redirectPath = process.env.REACT_APP_OAUTH_REDIRECT_PATH;
    const idToken = getIdToken()
    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        async function getIsLoggedIn() {
            const userIsLoggedIn = await isLoggedIn();

            setLoggedIn(userIsLoggedIn)
        }

        getIsLoggedIn()
    }, []);

    return (
        <div
            className="w-full flex flex-col md:flex-row justify-between items-center py-1 px-2 md:mt-0 border-b-2 relative"
        >
            <div className="flex items-center space-x-2 relative">
                <img
                    src="/images/logo.png"
                    width={50}
                    height={50}
                    alt="BeatGear Logo"
                />
                <span className={"pr-2"}>BeatGear</span>
            </div>
            <div className="flex items-center space-x-2 mt-4 md:mt-0 md:ml-auto relative">
                {
                    loggedIn ? (
                        <a
                            href={`${oauthUrl}/realms/${realmName}/protocol/openid-connect/logout?id_token_hint=${idToken}&post_logout_redirect_uri=${rootUrl}/auth/logout`}
                            className="button-secondary-blue py-1 px-3 rounded-lg"
                        >
                            Abmelden
                        </a>
                    ) : (
                        <a
                            href={`${oauthUrl}/realms/${realmName}/protocol/openid-connect/auth?client_id=${clientId}&redirect_uri=${rootUrl}${redirectPath}&response_type=code&scope=openid`}
                            className="button-secondary-blue py-1 px-3 rounded-lg"
                        >
                            Anmelden
                        </a>
                    )
                }
            </div>
        </div>
    );
}