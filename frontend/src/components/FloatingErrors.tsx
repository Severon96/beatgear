import React, {useContext} from "react";
import {ErrorContext} from "./providers/ErrorProvider";
import {ErrorSnackbar} from "./ErrorSnackbar";
import {Stack} from "@mui/material";

export function FloatingErrors() {
    const context = useContext(ErrorContext);

    return (
        <Stack>
            {context?.errors.map((error, index) => (
                <ErrorSnackbar key={index} error={error} index={index}/>
            ))}
        </Stack>
    )
}