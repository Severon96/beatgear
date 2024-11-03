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
    components: {
        MuiCard: {
            styleOverrides: {
                root: {
                    padding: "1rem",
                    marginBottom: "1rem",
                }
            },
        },
        MuiCardHeader: {
            defaultProps: {
                titleTypographyProps: {
                    variant: "h5",
                    align: "center"
                }
            }
        }
    },
    palette: {
        common: {
            black: "#222",
            white: "#F2F2F2"
        },
        primary: {
            main: "#3b7adf",
            light: "#f9f9f9",
            contrastText: common.white
        }
    },
    typography: {
        h1: {
            fontSize: "3rem",
            fontWeight: "600",
            wordSpacing: -5,
            letterSpacing: -1.5,
        },
        h2: {
            fontSize: "2.75rem",
            fontWeight: "600",
            wordSpacing: -5,
            letterSpacing: -1.5,
        },
        h3: {
            fontSize: "2.5rem",
            fontWeight: "600",
            wordSpacing: -5,
            letterSpacing: -1.5,
        },
        h4: {
            fontSize: "2.25rem",
            fontWeight: "600",
            wordSpacing: -5,
            letterSpacing: -1.5,
        },
        h5: {
            fontSize: "2rem",
            fontWeight: "600",
            wordSpacing: -3,
        },
        h6: {
            fontSize: "1.75rem",
            fontWeight: "600",
            wordSpacing: -4,
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