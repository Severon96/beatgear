import React, {useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {logout} from "../redux-tk/slices/authSlice";

const LogoutRedirect = () => {
    const navigate = useNavigate();

    useEffect(() => {
        logout();
        navigate("/");
    }, [navigate]);

    return <div>Leite weiter...</div>;
};

export default LogoutRedirect;
