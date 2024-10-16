import React from 'react';
import './App.css';
import {Dashboard} from "../Dashboard";
import MuiHeader from "../../components/AppBar";
import Container from "@mui/material/Container";

function App() {
    return (
        <div
            className="items-center justify-items-center min-h-screen pb-20 gap-16 font-[family-name:var(--font-geist-sans)] overflow-x-hidden relative">
            <main className="flex flex-col items-center sm:items-start w-full relative">
                <header className="w-full relative">
                    <MuiHeader/>
                </header>
                <Container maxWidth="xl">
                    <Dashboard/>
                </Container>
            </main>
        </div>
    );
}

export default App;
