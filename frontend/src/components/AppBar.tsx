import * as React from 'react';
import {useContext} from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import {isLoggedIn} from "../utils/auth";
import {useSelector} from "react-redux";
import {RootState} from "../store";
import {CartContext} from "./providers/CartProvider";
import {Badge} from "@mui/material";

const rootUrl = process.env.REACT_APP_ROOT_URL;
const oauthUrl = process.env.REACT_APP_OAUTH_ISSUER;
const realmName = process.env.REACT_APP_OAUTH_REALM;
const clientId = process.env.REACT_APP_OAUTH_CLIENT_ID;
const redirectPath = process.env.REACT_APP_OAUTH_REDIRECT_PATH;

function MuiHeader() {
    const {accessToken, idToken} = useSelector((state: RootState) => state.auth);
    const cartContext = useContext(CartContext);

    return (
        <AppBar position="static" sx={{
            mb: 2
        }}>
            <Container maxWidth="lg">
                <Toolbar disableGutters>
                    <Box
                        component="img"
                        src={"/images/logo.png"}
                        alt="BeatGear Logo"
                        sx={{
                            height: 50,
                            width: 50,
                            display: {xs: 'none', md: 'flex'},
                            mr: 1
                        }}
                    />
                    <Typography
                        variant="h6"
                        noWrap
                        component="a"
                        href="#app-bar-with-responsive-menu"
                        sx={{
                            mx: 2,
                            display: {xs: 'none', md: 'flex'},
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        BeatGear
                    </Typography>
                    <Box
                        component="img"
                        src={"/images/logo.png"}
                        alt="BeatGear Logo"
                        sx={{
                            height: 50,
                            width: 50,
                            display: {xs: 'flex', md: 'none'},
                            mr: 1
                        }}
                    />
                    <Typography
                        variant="h5"
                        noWrap
                        component="a"
                        href="#app-bar-with-responsive-menu"
                        sx={{
                            mx: 2,
                            display: {xs: 'flex', md: 'none'},
                            flexGrow: 1,
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        BeatGear
                    </Typography>
                    <Box sx={{
                        flexGrow: 0,
                        ml: 'auto'
                    }}>
                        {
                            isLoggedIn(accessToken) ??
                            <Badge badgeContent={cartContext.items.length}>
                                <IconButton
                                    aria-label="shopping-cart"
                                    sx={{
                                        color: "common.white"
                                    }}
                                >
                                    <ShoppingCartIcon/>
                                </IconButton>
                            </Badge>
                        }
                        {
                            isLoggedIn(accessToken) ?? false ? (
                                <IconButton
                                    href={`${oauthUrl}/realms/${realmName}/protocol/openid-connect/logout?id_token_hint=${idToken}&post_logout_redirect_uri=${rootUrl}/auth/logout`}
                                    aria-label="logout"
                                    sx={{
                                        color: "common.white"
                                    }}
                                >
                                    <LogoutIcon/>
                                </IconButton>
                            ) : (
                                <IconButton
                                    href={`${oauthUrl}/realms/${realmName}/protocol/openid-connect/auth?client_id=${clientId}&redirect_uri=${rootUrl}${redirectPath}&response_type=code&scope=openid`}
                                    aria-label="login"
                                    sx={{
                                        color: "common.white"
                                    }}
                                >
                                    <LoginIcon/>
                                </IconButton>
                            )
                        }
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}

export default MuiHeader;
