import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import LoginIcon from '@mui/icons-material/Login';


function MuiHeader() {
    return (
        <AppBar position="static" sx={{
            mb: 2
        }}>
            <Container maxWidth="xl">
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
                        <IconButton aria-label="login" sx={{
                            color: "common.white"
                        }}>
                            <LoginIcon />
                        </IconButton>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}

export default MuiHeader;
