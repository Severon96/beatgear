import React, {useContext, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {LoginContext} from "../components/providers/LoginProvider";

const LogoutRedirect = () => {
    const navigate = useNavigate();
    const context = useContext(LoginContext);

    useEffect(() => {
        context?.logOut();
        navigate("/");
    }, [navigate]);

    return <div>Leite weiter...</div>;
};

export default LogoutRedirect;
