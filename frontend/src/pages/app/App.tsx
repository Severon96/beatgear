import React from 'react';
import './App.css';
import Header from "../../components/AppBar";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import InitContainer from "../../components/InitContainer";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import {BrowseHardwarePage} from "../BrowseHardwarePage";
import LoginRedirect from "../OAuthLoginRedirectPage";
import LogoutRedirect from "../OAuthLogoutRedirectPage";
import {Dashboard} from "../Dashboard";
import InquireBookingPage from "../InquireBookingPage";
import {useSelector} from "react-redux";
import {RootState} from "../../store";
import {CircularProgress, Stack} from "@mui/material";
import InquiriesPage from "../InquiriesPage";


const router = createBrowserRouter([
    {
        path: "/",
        element: <Dashboard/>,
    },
    {
        path: "/browse-hardware",
        element: <BrowseHardwarePage/>
    },
    {
        path: "/request-booking",
        element: <InquireBookingPage/>
    },
    {
        path: "/inquiries",
        element: <InquiriesPage/>
    },
    {
        path: "/auth/callback",
        element: <LoginRedirect/>
    },
    {
        path: "/auth/logout",
        element: <LogoutRedirect/>
    }
]);

function App() {
    const {isRestoring} = useSelector((state: RootState) => state.auth);

    return (
        <Box>
            <InitContainer>
                <main>
                    <Header/>
                    <Container maxWidth="xl" sx={{marginTop: 2}}>
                        {
                            isRestoring ? (
                                <Stack justifyContent={"center"} alignItems={"center"}>
                                    <CircularProgress/>
                                </Stack>
                            ) : (
                                <RouterProvider router={router}/>
                            )
                        }
                    </Container>
                </main>
            </InitContainer>
        </Box>
    );
}

export default App;
