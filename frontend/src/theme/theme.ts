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

let theme = createTheme();

theme = createTheme(theme, {
    palette: {
        common: {
            black: '#222',
            white: '#f2f2f2'
        },
        primary: {
            main: "#0997C6",
            light: "#b2e3ef",
            contrastText: common.black
        },
        secondary: {
            main: '#c63809',
            light: '#ffad92',
            contrastText: common.white
        },
        background: {
            default: common.white,
            paper: common.white,
        },
    },
    components: {
        MuiContainer: {
            styleOverrides: {
                root: {
                    marginTop: 2
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                colorPrimary: {
                    backgroundColor: common.white,
                    color: common.black,
                }
            },
        },
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
        },
        MuiList: {
            styleOverrides: {
                root: {
                    backgroundColor: 'background.paper',
                    display: 'flex',
                    flexDirection: 'column',
                }
            }
        },
        MuiListItem: {
            styleOverrides: {
                root: {
                    width: '100%',
                    [theme.breakpoints.up('sm')]: {
                        width: '90%',
                    },
                    [theme.breakpoints.up('md')]: {
                        width: '80%',
                    },
                    [theme.breakpoints.up('lg')]: {
                        width: '70%',
                    },
                    margin: "8px 0",
                    display: "flex",
                }
            }
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    padding: 10
                }
            }
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