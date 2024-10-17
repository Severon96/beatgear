import React from 'react';
import './App.css';
import {Dashboard} from "../Dashboard";
import MuiHeader from "../../components/AppBar";
import Container from "@mui/material/Container";

function App() {
    return (
        <div>
            <main>
                <MuiHeader/>
                <Container maxWidth="xl">
                    <Dashboard/>
                </Container>
            </main>
        </div>
    );
}

export default App;
