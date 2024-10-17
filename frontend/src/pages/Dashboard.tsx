import React, {useEffect, useState} from "react";
import {isLoggedIn} from "../utils/auth";
import {UserLandingPage} from "./UserLandingPage";
import {LandingPage} from "./LandingPage";
import Container from "@mui/material/Container";

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
        <Container maxWidth={"lg"}>
            {
                loggedIn ? <UserLandingPage/> : <LandingPage/>
            }
        </Container>
    );
}