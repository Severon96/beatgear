import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import LoginIcon from '@mui/icons-material/Login';
import {isLoggedIn} from "../utils/auth";
import {Avatar, Link, Menu, MenuItem, Stack, Tooltip} from "@mui/material";
import {useSelector} from "react-redux";
import {RootState} from "../store";
import HeaderCartIcon from "./HeaderCartIcon";

const rootUrl = process.env.REACT_APP_ROOT_URL;
const oauthUrl = process.env.REACT_APP_OAUTH_ISSUER;
const realmName = process.env.REACT_APP_OAUTH_REALM;
const clientId = process.env.REACT_APP_OAUTH_CLIENT_ID;
const redirectPath = process.env.REACT_APP_OAUTH_REDIRECT_PATH;

const drawerWidth = 240;
const navItems = new Map<string, string>([
    ["/browse-hardware", "Mieten"],
]);
const settings = new Map<string, string>([
    ["/inquiries", "Anfragen"],
]);

export default function MuiHeader() {
    const {accessToken, idToken} = useSelector((state: RootState) => state.auth);
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

    if (!Array.from(settings.values()).some((value) => value === "Abmelden")) {
        settings.set(`${oauthUrl}/realms/${realmName}/protocol/openid-connect/logout?id_token_hint=${idToken}&post_logout_redirect_uri=${rootUrl}/auth/logout`, "Abmelden")
    }

    const handleDrawerToggle = () => {
        setMobileOpen((prevState) => !prevState);
    };
    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };


    const drawer = (
        <Box onClick={handleDrawerToggle} sx={{textAlign: 'center'}}>
            <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                justifyContent="center"
                padding={1}
            >
                <Box
                    component="img"
                    src={"/images/logo.png"}
                    alt="BeatGear Logo"
                    sx={{
                        height: 40,
                        width: 40,
                        display: {xs: 'flex', md: 'none'},
                        mr: 1
                    }}
                />
                <Typography
                    variant="h1"
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
            </Stack>
            <Divider/>
            {
                isLoggedIn(accessToken) && (
                    <List>
                        {Array.from(navItems.entries()).map(([link, label]) => (
                            <ListItem key={link} disablePadding>
                                <ListItemButton
                                    sx={{textAlign: 'center'}}
                                    href={link}
                                >
                                    <ListItemText primary={label}/>
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                )
            }
        </Box>
    );

    return (
        <Box
            sx={{
                display: 'flex',
            }}
        >
            <CssBaseline/>
            <AppBar component="nav" sx={{position: 'sticky', top: 0, zIndex: (theme) => theme.zIndex.drawer + 1}}>
                <Toolbar>
                    <Link href="/">
                        <Box
                            component="img"
                            src={"/images/logo.png"}
                            alt="BeatGear Logo"
                            sx={{
                                height: 50,
                                width: 50,
                                display: {xs: 'none', sm: 'flex'},
                                mr: 1
                            }}
                        />
                    </Link>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{mr: 2, display: {sm: 'none'}, height: 64}}
                    >
                        <MenuIcon/>
                    </IconButton>
                    <Typography
                        variant="h1"
                        noWrap
                        component="a"
                        href="/"
                        sx={{
                            mx: 2,
                            display: {xs: 'none', sm: 'flex'},
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        BeatGear
                    </Typography>
                    <Box sx={{display: {xs: 'none', sm: 'block'}}}>
                        {
                            isLoggedIn(accessToken) && Array.from(navItems.entries()).map(([link, label]) => (
                                <Button
                                    key={link}
                                    href={link}
                                    color={"inherit"}
                                    sx={{
                                        letterSpacing: '0.05em',
                                        fontWeight: 550,
                                        transition: 'transform 0.2s ease-in-out',
                                        '&:hover': {
                                            transform: 'scale(1.05)',
                                            backgroundColor: 'colors.white'
                                        }
                                    }}>
                                    {label}
                                </Button>
                            ))}
                    </Box>
                    <Box sx={{
                        flexGrow: 0,
                        ml: 'auto'
                    }}
                         color={"colors.common.black"}>
                        <HeaderCartIcon/>
                        {
                            !isLoggedIn(accessToken) && (
                                <IconButton
                                    href={`${oauthUrl}/realms/${realmName}/protocol/openid-connect/auth?client_id=${clientId}&redirect_uri=${rootUrl}${redirectPath}&response_type=code&scope=openid`}
                                    aria-label="login"
                                    sx={{
                                        color: "common.black"
                                    }}
                                >
                                    <LoginIcon/>
                                </IconButton>
                            )
                        }
                    </Box>
                    {isLoggedIn(accessToken) && (
                        <Box sx={{flexGrow: 0}}>
                            <Tooltip title="Open settings">
                                <IconButton onClick={handleOpenUserMenu} sx={{p: 0}}>
                                    <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg"/>
                                </IconButton>
                            </Tooltip>
                            <Menu
                                sx={{mt: '45px'}}
                                id="menu-appbar"
                                anchorEl={anchorElUser}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={Boolean(anchorElUser)}
                                onClose={handleCloseUserMenu}
                            >
                                {Array.from(settings.entries()).map(([link, label]) => (
                                    <MenuItem key={link} onClick={handleCloseUserMenu}>
                                        <Link href={link}>
                                            <Typography sx={{textAlign: 'center'}}>{label}</Typography>
                                        </Link>
                                    </MenuItem>
                                ))}
                            </Menu>
                        </Box>
                    )
                    }
                </Toolbar>
            </AppBar>
            <nav>
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true,
                    }}
                    sx={{
                        display: {xs: 'block', sm: 'none'},
                        '& .MuiDrawer-paper': {boxSizing: 'border-box', width: drawerWidth},
                    }}
                >
                    {drawer}
                </Drawer>
            </nav>
        </Box>
    );
}

