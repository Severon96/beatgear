import React, {useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {useDispatch} from "react-redux";
import {logout, restoreSession} from "../redux-tk/slices/authSlice";

const LogoutRedirect = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(restoreSession());
    }, [dispatch]);

    useEffect(() => {
        logout();
        navigate("/");
    }, [navigate]);

    return <div>Leite weiter...</div>;
};

export default LogoutRedirect;
