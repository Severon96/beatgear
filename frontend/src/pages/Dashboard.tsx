import React, {useEffect} from "react";
import {UserLandingPage} from "./UserLandingPage";
import {LandingPage} from "./LandingPage";
import Container from "@mui/material/Container";
import {FloatingErrors} from "../components/FloatingErrors";
import {useDispatch, useSelector} from "react-redux";
import {restoreSession} from "../redux/authSlice";
import {RootState} from "../store";
import {isLoggedIn} from "../utils/auth";

export function Dashboard() {
    const dispatch = useDispatch();
    const {accessToken} = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        dispatch(restoreSession());
    }, [dispatch]);

    return (
        <Container maxWidth={"lg"}>
            {
                isLoggedIn(accessToken) ? <UserLandingPage/> : <LandingPage/>
            }
            <FloatingErrors/>
        </Container>
    );
}