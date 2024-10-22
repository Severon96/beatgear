import React from "react";
import {ActiveBookings} from "../components/ActiveBookings";
import Box from "@mui/material/Box";

export function UserLandingPage() {
    return (
        <Box>
            <ActiveBookings />
            <ActiveBookings />
        </Box>
    );
}