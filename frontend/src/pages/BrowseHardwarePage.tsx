import React from "react";
import Container from "@mui/material/Container";
import {FloatingErrors} from "../components/FloatingErrors";
import Typography from "@mui/material/Typography";

export function BrowseHardwarePage() {
    // const cartContext = useContext(CartContext);

    return (
        <Container maxWidth={"lg"}>
            <FloatingErrors/>
            <Typography>Test</Typography>
        </Container>
    );
}