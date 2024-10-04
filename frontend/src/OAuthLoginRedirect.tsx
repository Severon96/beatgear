import React from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {setAccessTokenByAuthorizationCode} from "./utils/auth";

const LoginRedirect = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const {searchParams} = new URL(window.location.href);
        const code = searchParams.get('code');

        setAccessTokenByAuthorizationCode(code).then(() => navigate('/'))
    }, [navigate]);

    return <div>Leite weiter...</div>;
};

export default LoginRedirect;
