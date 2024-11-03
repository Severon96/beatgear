import React from 'react';
import './App.css';
import {Dashboard} from "../Dashboard";
import MuiHeader from "../../components/AppBar";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import InitContainer from "../../components/InitContainer";


function App() {
    return (
        <Box>
            <InitContainer>
                <main>
                    <MuiHeader/>
                    <Container maxWidth="xl">
                        <Dashboard/>
                    </Container>
                </main>
            </InitContainer>
        </Box>
    );
}

export default App;
