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
    },
    typography: {
        h1: {
            fontSize: "3rem",
            letterSpacing: -1.5,
        },
        h2: {
            fontSize: "2.75rem",
            letterSpacing: -1.5,
        },
        h3: {
            fontSize: "2.5rem",
            letterSpacing: -1.5,
        },
        h4: {
            fontSize: "2.25rem",
            letterSpacing: -1.5,
        },
        h5: {
            fontSize: "2rem",
            letterSpacing: -1.5,
        },
        h6: {
            fontSize: "1.75rem",
            letterSpacing: -1.5,
        },
        subtitle1: {
            letterSpacing: -0.5,
        },
        subtitle2: {
            letterSpacing: -0.5,
        }
    }
});
theme = responsiveFontSizes(theme);

export default theme;