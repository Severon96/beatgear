import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './pages/app/App';
import reportWebVitals from './reportWebVitals';
import {ThemeProvider} from "@mui/material";
import theme from "./theme/theme";
import {ErrorProvider} from "./components/providers/ErrorProvider";
import {Provider} from "react-redux";
import store from "./store";
import {CartProvider} from "./components/providers/CartProvider";

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <React.StrictMode>
        <ThemeProvider theme={theme}>
            <ErrorProvider>
                <CartProvider>
                    <Provider store={store}>
                        <App />
                    </Provider>
                </CartProvider>
            </ErrorProvider>
        </ThemeProvider>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
