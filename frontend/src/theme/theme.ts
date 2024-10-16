import {createTheme, responsiveFontSizes} from "@mui/material";

declare module '@mui/material/styles' {
    interface Theme {
        status: {
            danger: string;
        };
    }
    // allow configuration using `createTheme`
    interface ThemeOptions {
        status?: {
            danger?: string;
        };
    }
}

let theme = createTheme();
theme = responsiveFontSizes(theme);

export default theme;