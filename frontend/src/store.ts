import {configureStore} from '@reduxjs/toolkit';
import authReducer from "./redux-tk/slices/authSlice";
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import {logger} from "redux-logger";
import bookingReducer from "./redux-tk/slices/bookingSlice";
import hardwareReducer from "./redux-tk/slices/hardwareSlice";

const store = configureStore({
    reducer: {
        auth: authReducer,
        bookings: bookingReducer,
        hardware: hardwareReducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()

export default store;
