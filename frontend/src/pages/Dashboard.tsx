import React, {useEffect, useState} from "react";
import {isLoggedIn} from "../utils/auth";
import {UserLandingPage} from "./UserLandingPage";
import {LandingPage} from "./LandingPage";

export function Dashboard() {
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
            className="items-center justify-items-center min-h-screen pb-20 gap-16 font-[family-name:var(--font-geist-sans)] overflow-x-hidden relative"
            suppressHydrationWarning={true}>
            {
                loggedIn ? <UserLandingPage/> : <LandingPage/>
            }
        </div>
    );
}