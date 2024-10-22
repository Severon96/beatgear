import React, {useContext} from "react";
import {isLoggedIn} from "../utils/auth";
import {UserLandingPage} from "./UserLandingPage";
import {LandingPage} from "./LandingPage";
import Container from "@mui/material/Container";
import {FloatingErrors} from "../components/FloatingErrors";
import {LoginContext} from "../components/providers/LoginProvider";

export function Dashboard() {
    const context = useContext(LoginContext);
    console.log("login context", context);
    console.log("isLoggedIn:", isLoggedIn(context?.accessToken));
    return (
        <Container maxWidth={"lg"}>
            {
                isLoggedIn(context?.accessToken) ? <UserLandingPage/> : <LandingPage/>
            }
            <FloatingErrors />
        </Container>
    );
}