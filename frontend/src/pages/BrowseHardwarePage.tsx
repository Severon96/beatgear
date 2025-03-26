import React, {useEffect} from "react";
import Container from "@mui/material/Container";
import {FloatingErrors} from "../components/FloatingErrors";
import Typography from "@mui/material/Typography";
import {Box, Card, CircularProgress, Paper, Stack} from "@mui/material";
import {RootState, useAppDispatch, useAppSelector} from "../store";
import {fetchHardware} from "../redux-tk/slices/hardwareSlice";
import {LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFnsV3";
import {de} from "date-fns/locale";
import NotFoundErrorPage from "./NotFoundErrorPage";
import {isLoggedIn} from "../utils/auth";
import {useSelector} from "react-redux";

export function BrowseHardwarePage() {
    const {accessToken} = useSelector((state: RootState) => state.auth);
    const dispatch = useAppDispatch();
    let hardwareLoaded = false;
    const hardware = useAppSelector((state) => state.hardware.hardware);
    const hardwareStatus = useAppSelector((state) => state.hardware.fetchHardwareStatus);

    useEffect(() => {
        if (!hardwareLoaded) {
            dispatch(fetchHardware({
                "bookingStart": null,
                "bookingEnd": null
            }))
        }
    }, [dispatch, hardwareStatus]);

    function renderBrowseHardwarePage() {
        return <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={de}>
            <Container maxWidth={"lg"}>
                <FloatingErrors/>
                <Paper>
                    <Box display={"flex"} flexDirection={"column"} gap={2} marginBottom={2}>
                        <Typography variant={"h1"}>Equipment suchen</Typography>
                        <Box display="flex" flexDirection={{md: "row", xs: "column"}} gap={2}>
                            {hardwareStatus === 'loading' ? (
                                <Box display={"flex"} width={"100%"} justifyContent={"center"}>
                                    <CircularProgress/>
                                </Box>
                            ) : (
                                <Stack>
                                    {hardware.map((hardwareEntry, index) => (
                                        <Card key={index}>{hardwareEntry.name}</Card>
                                    ))}
                                </Stack>
                            )}
                        </Box>
                    </Box>
                </Paper>
            </Container>
        </LocalizationProvider>;
    }

    return isLoggedIn(accessToken) ? renderBrowseHardwarePage() : <NotFoundErrorPage/>;
}