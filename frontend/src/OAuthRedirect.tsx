import React from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {setAccessTokenByAuthorizationCode} from "./utils/auth";

const Redirect = () => {
    const navigate = useNavigate();
    console.log("redirect loaded");

    useEffect(() => {
        const {searchParams} = new URL(window.location.href);
        const code = searchParams.get('code');
        console.log("use effect called");
        setAccessTokenByAuthorizationCode(code).then(() => navigate('/'))
    }, [navigate]);

    return <div>Leite weiter...</div>;
};

export default Redirect;
