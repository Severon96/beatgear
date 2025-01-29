import React, {useEffect, useState} from "react";
import Container from "@mui/material/Container";
import {FloatingErrors} from "../components/FloatingErrors";
import Typography from "@mui/material/Typography";
import {Box, CircularProgress, Paper} from "@mui/material";
import HardwareSearch from "../components/HardwareSearch";
import {RootState, useAppDispatch, useAppSelector} from "../store";
import {fetchHardware} from "../redux-tk/slices/hardwareSlice";
import {DateTimePicker, LocalizationProvider, renderTimeViewClock} from "@mui/x-date-pickers";
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFnsV3";
import {de} from "date-fns/locale";
import NotFoundErrorPage from "./NotFoundErrorPage";
import {isLoggedIn} from "../utils/auth";
import {useSelector} from "react-redux";

export function BrowseHardwarePage() {
    const {accessToken} = useSelector((state: RootState) => state.auth);
    const dispatch = useAppDispatch();
    const [bookingStart, setBookingStart] = useState<Date | null>(null)
    const [bookingEnd, setBookingEnd] = useState<Date | null>(null)
    const hardware = useAppSelector((state) => state.hardware.hardware);
    const hardwareStatus = useAppSelector((state) => state.hardware.fetchHardwareStatus);
    const errorMessage = bookingStart && bookingEnd ? null : "Bitte Start- und Enddatum der Buchung auswählen."

    useEffect(() => {
        if (bookingStart && bookingEnd && !hardwareStatus) {
            dispatch(fetchHardware({
                "bookingStart": bookingStart.toISOString(),
                "bookingEnd": bookingEnd.toISOString()
            }))
        }
    }, [dispatch, bookingStart, bookingEnd, hardwareStatus]);

    function renderBrowseHardwarePage() {
        return <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={de}>
            <Container maxWidth={"lg"}>
                <FloatingErrors/>
                <Paper>
                    <Box display={"flex"} flexDirection={"column"} gap={2} marginBottom={2}>
                        <Typography variant={"h1"}>Equipment suchen</Typography>
                        <Box display="flex" flexDirection={{md: "row", xs: "column"}} gap={2}>
                            <DateTimePicker
                                viewRenderers={{
                                    hours: renderTimeViewClock,
                                    minutes: renderTimeViewClock,
                                    seconds: renderTimeViewClock,
                                }}
                                label="Von"
                                value={bookingStart}
                                onChange={(date: Date | null) => setBookingStart(date)}
                                slotProps={{textField: {fullWidth: true, required: true}}}
                                minDate={new Date()}
                            />
                            <DateTimePicker
                                viewRenderers={{
                                    hours: renderTimeViewClock,
                                    minutes: renderTimeViewClock,
                                    seconds: renderTimeViewClock,
                                }}
                                label="Bis"
                                value={bookingEnd}
                                disabled={bookingStart === null}
                                onChange={(date: Date | null) => setBookingEnd(date)}
                                slotProps={{textField: {fullWidth: true, required: true}}}
                                minDate={bookingStart ?? new Date()}
                            />
                        </Box>
                    </Box>
                    {hardwareStatus === 'loading' ? (
                        <Box display={"flex"} width={"100%"} justifyContent={"center"}>
                            <CircularProgress/>
                        </Box>
                    ) : (
                        <HardwareSearch hardwareList={hardware} bookingStart={bookingStart} bookingEnd={bookingEnd}
                                        errorMessage={errorMessage}/>
                    )}
                </Paper>
            </Container>
        </LocalizationProvider>;
    }

    return isLoggedIn(accessToken) ? renderBrowseHardwarePage() : <NotFoundErrorPage/>;
}