import {createTheme, responsiveFontSizes} from "@mui/material";
import {common} from "@mui/material/colors";

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

let theme = createTheme({
    palette: {
        common: {
            black: "#222",
            white: "#F2F2F2"
        },
        primary: {
            main: "#F2F2F2",
            light: "#f9f9f9",
            contrastText: common.black
        }
    }
});
theme = responsiveFontSizes(theme);

export default theme;