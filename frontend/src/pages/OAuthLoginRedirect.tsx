import React, {useContext} from 'react';
import {useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {getAccessTokenByAuthorizationCode} from "../utils/auth";
import Box from "@mui/material/Box";
import {LoginContext} from "../components/providers/LoginProvider";
import {ErrorContext} from "../components/providers/ErrorProvider";

const LoginRedirect = () => {
    const navigate = useNavigate();
    const context = useContext(LoginContext);
    const errorContext = useContext(ErrorContext);

    useEffect(() => {
        const {searchParams} = new URL(window.location.href);
        const code = searchParams.get('code');
        console.log("auth code", code);
        getAccessTokenByAuthorizationCode(code).then(({accessToken, refreshToken, idToken}) => {
            context?.logIn(accessToken, refreshToken, idToken);
            navigate('/');
        }).catch((error: Error) => {
            errorContext.addError({message: error.message});
        })
    }, [navigate]);

    return <Box>Leite weiter...</Box>;
};

export default LoginRedirect;
