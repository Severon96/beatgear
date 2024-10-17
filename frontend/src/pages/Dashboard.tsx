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
        <div>
            {
                loggedIn ? <UserLandingPage/> : <LandingPage/>
            }
        </div>
    );
}