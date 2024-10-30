import React, {useContext, useEffect, useState} from "react";
import Box from "@mui/material/Box";
import {Card, CardContent, CardHeader, Stack} from "@mui/material";
import {createBooking, fetchActiveBookings} from "../redux-tk/slices/bookingSlice";
import {useAppDispatch, useAppSelector} from "../store";
import Typography from "@mui/material/Typography";
import {DialogPopup} from "./DialogPopup";
import {BookingForm} from "./BookingForm";
import {BookingRequest} from "../models/Booking";
import {ErrorContext} from "./providers/ErrorProvider";

export function ActiveBookings() {
    const dispatch = useAppDispatch();
    const activeBookings = useAppSelector(state => state.bookings.activeBookings)
    const createBookingStatus = useAppSelector(state => state.bookings.createBookingStatus);
    const [bookingCreated, setBookingCreated] = useState(false)
    const errorContext = useContext(ErrorContext);

    function onNewBookingSubmitted(booking: BookingRequest) {
        dispatch(createBooking(booking));
    }

    function displayBookings() {
        return (
            <Card>
                <CardHeader title={"Buchungen"}/>
                <CardContent>
                    {
                        activeBookings.length > 0 ? (
                            <Box>
                                <p>{`Bookings of user`}</p>
                                <p>Current active bookings</p>
                            </Box>
                        ) : (
                            <Stack alignItems={"center"}>
                                <Typography variant={'subtitle1'}>You have no bookings, feel free to create
                                    one!</Typography>
                                <DialogPopup dialogTitle={"Booking anlegen"} buttonName={"Booking anlegen"}>
                                    {
                                        bookingCreated ? <Typography>Booking created</Typography> :
                                            <BookingForm onFormSubmit={onNewBookingSubmitted}/>}
                                </DialogPopup>
                            </Stack>
                        )
                    }
                </CardContent>
            </Card>
        )
    }

    useEffect(() => {
        dispatch(fetchActiveBookings())

        if(createBookingStatus == "succeeded") {
            setBookingCreated(true)
        }
        if(createBookingStatus == "failed") {
            errorContext.addError({"message": "Booking creation failed"})
        }
    }, [createBookingStatus, dispatch]);

    return (
        <Box>
            {displayBookings()}
        </Box>
    );
}