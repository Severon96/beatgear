import { createContext, useContext, useState, ReactNode } from 'react';
import React from "react";

interface AuthContextType {
    accessToken: string | null;
    refreshToken: string | null;
    setTokens: (tokens: { accessToken: string; refreshToken: string }) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [tokens, setTokens] = useState<{ accessToken: string | null; refreshToken: string | null }>({
        accessToken: null,
        refreshToken: null,
    });

    const updateTokens = (newTokens: { accessToken: string; refreshToken: string }) => {
        setTokens(newTokens);
        localStorage.setItem('access_token', newTokens.accessToken);
        localStorage.setItem('refresh_token', newTokens.refreshToken);
    };

    return (
        <AuthContext.Provider value={{ accessToken: tokens.accessToken, refreshToken: tokens.refreshToken, setTokens: updateTokens }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
