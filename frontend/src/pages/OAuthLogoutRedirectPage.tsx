import React, {useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {logout} from "../redux-tk/slices/authSlice";
import {useDispatch} from "react-redux";

const LogoutRedirect = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();


    useEffect(() => {
        dispatch(logout());
        navigate("/");
    }, [navigate]);

    return <div>Leite weiter...</div>;
};

export default LogoutRedirect;
