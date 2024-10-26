import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Slide} from "@mui/material";
import React from "react";
import {TransitionProps} from "@mui/material/transitions";

interface PopupProps {
    buttonName: string;
    dialogTitle: string;
    children: React.ReactNode;
}

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props}>{props.children}</Slide>;
});
export const DialogPopup: React.FC<PopupProps> = ({children, buttonName, dialogTitle}) => {
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <React.Fragment>
            <Button variant="outlined" onClick={handleClickOpen}>
                {buttonName}
            </Button>
            <Dialog
                open={open}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>{dialogTitle}</DialogTitle>
                <DialogContent>
                    {children}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Disagree</Button>
                    <Button onClick={handleClose}>Agree</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}