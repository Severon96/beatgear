import React, {useEffect, useState} from "react";
import Container from "@mui/material/Container";
import {FloatingErrors} from "../components/FloatingErrors";
import Typography from "@mui/material/Typography";
import {Box, Paper} from "@mui/material";
import HardwareSearch from "../components/HardwareSearch";
import {useAppDispatch, useAppSelector} from "../store";
import {fetchHardware} from "../redux-tk/slices/hardwareSlice";
import {DateTimePicker, LocalizationProvider, renderTimeViewClock} from "@mui/x-date-pickers";
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFnsV3";
import {de} from "date-fns/locale";

export function BrowseHardwarePage() {
    const dispatch = useAppDispatch();
    const [bookingStart, setBookingStart] = useState<Date | null>(null)
    const [bookingEnd, setBookingEnd] = useState<Date | null>(null)
    const hardware = useAppSelector((state) => state.hardware.hardware);
    const hardwareStatus = useAppSelector((state) => state.hardware.fetchHardwareStatus);
    const errorMessage = bookingStart && bookingEnd ? null : "Bitte Start- und Enddatum für die Buchung auswählen."

    useEffect(() => {
        console.log("Hardware values: ", hardware);
        if (bookingStart && bookingEnd) {
            dispatch(fetchHardware({
                "booking_start": bookingStart.toISOString(),
                "booking_end": bookingEnd.toISOString()
            }))
        }
    }, [dispatch, bookingStart, bookingEnd, hardware, hardwareStatus]);

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={de}>
            <Container maxWidth={"lg"}>
                <FloatingErrors/>
                <Paper>
                    <Box display={"flex"} flexDirection={"column"} gap={2} marginBottom={2}>
                        <Typography>Nach Hardware suchen</Typography>
                        <Box display="flex" flexDirection={"row"} gap={2}>
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
                    <HardwareSearch hardwareList={hardware} errorMessage={errorMessage}/>
                </Paper>
            </Container>
        </LocalizationProvider>
    );
}