import React, {createContext, ReactNode, useState} from 'react';

interface LoginContextType {
    isLoggedIn: boolean;
    accessToken: string | null;
    refreshToken: string | null;
    idToken: string | null;
    logIn: (accessToken: string, refreshToken: string, idToken: string) => void;
    logOut: () => void;
}

export const LoginContext = createContext<LoginContextType | undefined>(undefined);

interface LoginProviderProps {
    children: ReactNode;
}

export const LoginProvider: React.FC<LoginProviderProps> = ({children}) => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [refreshToken, setRefreshToken] = useState<string | null>(null);
    const [idToken, setIdToken] = useState<string | null>(null);

    const logIn = (accessToken: string, refreshToken: string, idToken: string) => {
        setIsLoggedIn(true);
        setAccessToken(accessToken);
        setRefreshToken(refreshToken);
        setIdToken(idToken);
    };

    const logOut = () => {
        setIsLoggedIn(false);
        setAccessToken(null);
        setRefreshToken(null);
        setIdToken(null);
    };

    return (
        <LoginContext.Provider value={{isLoggedIn, accessToken, refreshToken, idToken, logIn, logOut}}>
            {children}
        </LoginContext.Provider>
    );
};
