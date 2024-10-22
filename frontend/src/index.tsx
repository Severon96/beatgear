import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './pages/app/App';
import reportWebVitals from './reportWebVitals';
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import LoginRedirect from "./pages/OAuthLoginRedirect";
import LogoutRedirect from "./pages/OAuthLogoutRedirect";
import {ThemeProvider} from "@mui/material";
import theme from "./theme/theme";
import {ErrorProvider} from "./components/providers/ErrorProvider";
import {LoginProvider} from "./components/providers/LoginProvider";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App/>,
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

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <React.StrictMode>
        <ThemeProvider theme={theme}>
            <ErrorProvider>
                <LoginProvider>
                    <RouterProvider router={router}/>
                </LoginProvider>
            </ErrorProvider>
        </ThemeProvider>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
