import Box from "@mui/material/Box";
import {Button, Card, CardContent, CardHeader, Popper} from "@mui/material";
import React, {useEffect} from "react";
import IconButton from "@mui/material/IconButton";
import CloseIcon from '@mui/icons-material/Close';

interface PopupProps {
    buttonName: string;
    children: React.ReactNode;
}

export const Popup: React.FC<PopupProps> = ({children, buttonName}) => {
    const [open, setOpen] = React.useState(false);
    const id = open ? 'simple-popper' : undefined;

    const handleOpenPopupClick = () => {
        setOpen(true);
    };

    const handleClosePopupClick = () => {
        setOpen(false);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
            setOpen(false);
        }
    };

    useEffect(() => {
        if (open) {
            document.addEventListener('keydown', handleKeyDown);
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [open]);

    return (
        <Box>
            <Button aria-describedby={id} type="button" onClick={handleOpenPopupClick}>
                {buttonName}
            </Button>
            <Popper id={id} open={open} anchorEl={document.body} sx={{
                position: "fixed",
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)'
            }}>
                <Card>
                    <CardHeader>
                        <IconButton onClick={handleClosePopupClick}>
                            <CloseIcon/>
                        </IconButton>
                    </CardHeader>
                    <CardContent>
                        {children}
                    </CardContent>
                </Card>
            </Popper>
        </Box>
    )
}