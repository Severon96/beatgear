import React, {useContext, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {getAccessTokenByAuthorizationCode} from "../utils/auth";
import Box from "@mui/material/Box";
import {ErrorContext} from "../components/providers/ErrorProvider";
import {login, restoreSession} from "../redux/authSlice";
import {useDispatch} from "react-redux";

const LoginRedirect = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const errorContext = useContext(ErrorContext);

    useEffect(() => {
        dispatch(restoreSession());
        const {searchParams} = new URL(window.location.href);
        const code = searchParams.get('code');
        console.log("auth code", code);
        getAccessTokenByAuthorizationCode(code).then((tokens) => {
            dispatch(login(tokens));
            navigate('/');
        }).catch((error: Error) => {
            errorContext.addError({message: error.message});
        })
    }, [navigate, dispatch]);

    return <Box>Leite weiter...</Box>;
};

export default LoginRedirect;
