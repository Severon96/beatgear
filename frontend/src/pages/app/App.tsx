import React from 'react';
import './App.css';
import {Dashboard} from "../Dashboard";
import MuiHeader from "../../components/AppBar";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";


function App() {
    return (
        <Box>
            <main>
                <MuiHeader/>
                <Container maxWidth="xl">
                    <Dashboard/>
                </Container>
            </main>
        </Box>
    );
}

export default App;
