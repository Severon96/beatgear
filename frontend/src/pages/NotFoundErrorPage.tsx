import * as React from 'react';
import {Alert, AlertTitle, Button, Stack} from "@mui/material";
import Typography from "@mui/material/Typography";


export default function NotFoundErrorPage() {
    return (
        <Stack justifyContent={'center'} alignContent={"center"} alignItems={'center'}>
            <Alert severity={"warning"} action={
                <Button href={"/"}>
                    Zurück zum Start
                </Button>
            }>
                <AlertTitle>Bitte wenden!</AlertTitle>
                <Typography>Du scheinst dich verfahren zu haben!</Typography>
                <Typography>Was auch immer du suchst, hier wirst du es nicht finden.</Typography>
                <Typography>Vielleicht fängst du besser nochmal von vorne an?</Typography>
            </Alert>
        </Stack>
    );
}
