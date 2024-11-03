import React, {FC, ReactNode, useEffect} from "react";
import {useAppDispatch} from "../store";
import {restoreSession} from "../redux-tk/slices/authSlice";

interface InitContainerProps {
    children: ReactNode;
}

const InitContainer: FC<InitContainerProps> = ({children}) => {
    const dispatch = useAppDispatch();

    useEffect(() => {
       dispatch(restoreSession())
    }, [dispatch]);

    return (
        <>
            {children}
        </>
    )
}

export default InitContainer;