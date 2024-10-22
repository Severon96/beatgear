import React, {createContext, ReactNode, useState} from 'react';
import {ErrorContextType, SnackbarError} from "../models/Error";

export const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

interface ErrorProviderProps {
    children: ReactNode;
}

export const ErrorProvider: React.FC<ErrorProviderProps> = ({children}) => {
    const [errors, setErrors] = useState<SnackbarError[]>([]);

    const addError = (error: SnackbarError) => {
        setErrors((prevErrors) => [...prevErrors, error]);
    };

    return (
        <ErrorContext.Provider value={{errors, addError}}>
            {children}
        </ErrorContext.Provider>
    );
};
