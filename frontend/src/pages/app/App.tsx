import React from 'react';
import './App.css';
import {Dashboard} from "../Dashboard";
import MuiHeader from "../../components/AppBar";
import Container from "@mui/material/Container";
import {ErrorProvider} from "../../components/ErrorProvider";
import Box from "@mui/material/Box";


function App() {

    return (
        <Box>
            <main>
                <MuiHeader/>
                <ErrorProvider>
                    <Container maxWidth="xl">
                        <Dashboard/>
                    </Container>
                </ErrorProvider>
            </main>
        </Box>
    );
}

export default App;
