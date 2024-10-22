import React, {useState} from "react";
import {SnackbarError} from "../models/Error";
import {Alert, Snackbar} from "@mui/material";

interface ErrorSnackbarProps {
    error: SnackbarError,
    index: number
}

export const ErrorSnackbar: React.FC<ErrorSnackbarProps> = ({error, index}) => {
    const [errors, setErrors] = useState<SnackbarError[]>([]);

    function handleClose() {
        errors.splice(index, 1);
        setErrors(errors);
    }

    return (
        <Snackbar
            anchorOrigin={{vertical: "bottom", horizontal: "right"}}
            open={true}
            onClose={handleClose}
        >
            <Alert
                severity={"error"}
                variant={"filled"}
            >
                {error.message}
            </Alert>
        </Snackbar>
    );
}
