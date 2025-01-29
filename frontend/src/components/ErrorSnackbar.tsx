import React, {useState} from "react";
import {SnackbarError} from "../models/Error";
import {Alert, Snackbar} from "@mui/material";

interface ErrorSnackbarProps {
    error: SnackbarError,
    index: number
}

export const ErrorSnackbar: React.FC<ErrorSnackbarProps> = ({error, index}) => {
    const [errors, setErrors] = useState<SnackbarError[]>([]);
    const [open, setOpen] = React.useState(true);

    function handleClose() {
        errors.splice(index, 1);
        setErrors(errors);
        setOpen(false);
    }

    return (
        <Snackbar
            anchorOrigin={{vertical: "top", horizontal: "right"}}
            open={open}
            onClose={handleClose}
            autoHideDuration={6000}
        >
            <Alert
                severity={"error"}
                variant={"filled"}
                onClose={handleClose}
            >
                {error.message}
            </Alert>
        </Snackbar>
    );
}
