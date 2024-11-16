import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
    isLoggedIn: boolean;
    accessToken: string | null;
    refreshToken: string | null;
    isRestoring: boolean;
    idToken: string | null;
}

const initialState: AuthState = {
    isLoggedIn: false,
    accessToken: null,
    refreshToken: null,
    isRestoring: true,
    idToken: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login(state, action: PayloadAction<{ accessToken: string; refreshToken: string; idToken: string }>) {
            state.isLoggedIn = true;
            state.accessToken = action.payload.accessToken;
            state.refreshToken = action.payload.refreshToken;
            state.idToken = action.payload.idToken;
            state.isRestoring = false;
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('accessToken', action.payload.accessToken);
            localStorage.setItem('refreshToken', action.payload.refreshToken);
            localStorage.setItem('idToken', action.payload.idToken);
        },
        logout(state) {
            state.isLoggedIn = false;
            state.accessToken = null;
            state.refreshToken = null;
            state.idToken = null;
            state.isRestoring = false;
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('idToken');
        },
        restoreSession(state) {
            const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

            if (isLoggedIn) {
                state.isLoggedIn = true;
                state.accessToken = localStorage.getItem('accessToken');
                state.refreshToken = localStorage.getItem('refreshToken');
                state.idToken = localStorage.getItem('idToken');
            }

            state.isRestoring = false;
        },
    },
});

export const { login, logout, restoreSession } = authSlice.actions;
export default authSlice.reducer;
