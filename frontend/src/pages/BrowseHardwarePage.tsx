import React from "react";
import Container from "@mui/material/Container";
import {FloatingErrors} from "../components/FloatingErrors";

export function BrowseHardwarePage() {
    // const cartContext = useContext(CartContext);

    return (
        <Container maxWidth={"lg"}>
            <FloatingErrors/>
        </Container>
    );
}