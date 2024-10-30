import React, {useContext, useEffect, useState} from "react";
import Box from "@mui/material/Box";
import {
    Avatar,
    Card,
    CardContent,
    CardHeader,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Stack
} from "@mui/material";
import {createBooking, fetchActiveBookings} from "../redux-tk/slices/bookingSlice";
import {useAppDispatch, useAppSelector} from "../store";
import Typography from "@mui/material/Typography";
import {DialogPopup} from "./DialogPopup";
import {BookingForm} from "./BookingForm";
import {BookingRequest} from "../models/Booking";
import {ErrorContext} from "./providers/ErrorProvider";
import SurroundSoundIcon from '@mui/icons-material/SurroundSound';
import {formatDate} from "../utils/generalUtils";

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
                            <List sx={{width: '100%', maxWidth: 360, bgcolor: 'background.paper'}}>
                                {activeBookings.map((booking) => {
                                        const hardwareNames = booking.hardware.map((hardware) => hardware.name);

                                        return (
                                            <ListItem key={booking.id}>
                                                <ListItemAvatar>
                                                    <Avatar>
                                                        <SurroundSoundIcon/>
                                                    </Avatar>
                                                </ListItemAvatar>
                                                <ListItemText
                                                    primary={`${formatDate(booking.booking_start)} - ${formatDate(booking.booking_end)}`}
                                                    secondary={`${hardwareNames.join(", ")}`}/>
                                            </ListItem>
                                        );
                                    }
                                )
                                }
                            </List>
                        ) : (
                            <Stack alignItems={"center"}>
                                <Typography variant={'subtitle1'}>Du hast noch keine Buchungen. Erstell doch
                                    eine!</Typography>
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

        if (createBookingStatus == "succeeded") {
            setBookingCreated(true)
        }
        if (createBookingStatus == "failed") {
            errorContext.addError({"message": "Booking creation failed"})
        }
    }, [createBookingStatus, dispatch]);

    return (
        <Box>
            {displayBookings()}
        </Box>
    );
}