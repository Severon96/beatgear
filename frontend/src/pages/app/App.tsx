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


const router = createBrowserRouter([
    {
        path: "/",
        element: <Dashboard/>,
        children: [
            {
                path: "/browse-hardware",
                element: <BrowseHardwarePage/>
            }
        ]
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
    return (
        <Box>
            <InitContainer>
                <main>
                    <Header/>
                    <Container maxWidth="xl">
                        <RouterProvider router={router}/>
                    </Container>
                </main>
            </InitContainer>
        </Box>
    );
}

export default App;
