import React, {useContext} from "react";
import Box from "@mui/material/Box";
import {ErrorContext} from "./ErrorProvider";
import {ErrorSnackbar} from "./ErrorSnackbar";

export function FloatingErrors() {
    const context = useContext(ErrorContext);

    return (
        <Box>
            {context?.errors.map((error, index) => (
                <ErrorSnackbar key={index} error={error} index={index}/>
            ))}
        </Box>
    )
}