import React, {useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {deleteTokens} from "../utils/auth";

const LogoutRedirect = () => {
    const navigate = useNavigate();

    useEffect(() => {
        deleteTokens();
        navigate("/");
    }, [navigate]);

    return <div>Leite weiter...</div>;
};

export default LogoutRedirect;
