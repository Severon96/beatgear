import React from "react";
import {UserLandingPage} from "./UserLandingPage";
import {LandingPage} from "./LandingPage";
import Container from "@mui/material/Container";
import {FloatingErrors} from "../components/FloatingErrors";
import {useSelector} from "react-redux";
import {RootState} from "../store";
import {isLoggedIn} from "../utils/auth";

export function Dashboard() {
    const {accessToken} = useSelector((state: RootState) => state.auth);

    return (
        <Container maxWidth={"lg"}>
            {
                isLoggedIn(accessToken) ? <UserLandingPage/> : <LandingPage/>
            }
            <FloatingErrors/>
        </Container>
    );
}