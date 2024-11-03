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
import {createBooking, fetchBookings} from "../redux-tk/slices/bookingSlice";
import {useAppDispatch, useAppSelector} from "../store";
import Typography from "@mui/material/Typography";
import {DialogPopup} from "./DialogPopup";
import {BookingForm} from "./BookingForm";
import {BookingRequest} from "../models/Booking";
import {ErrorContext} from "./providers/ErrorProvider";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
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
                            <List
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    width: '100vw',
                                    maxWidth: "100%",
                                    bgcolor: 'background.paper',
                                }}
                            >
                                {activeBookings.map((booking) => {
                                        const hardwareNames = booking.hardware.map((hardware) => hardware.name);

                                        return (
                                            <ListItem
                                                key={booking.id}
                                                sx={{
                                                    width: {
                                                        xs: '100%',
                                                        sm: '90%',
                                                        md: '80%',
                                                        lg: '70%',
                                                    },
                                                    border: "1px solid #ddd",
                                                    borderRadius: "8px",
                                                    backgroundColor: "#f9f9f9",
                                                    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                                                    margin: "8px 0",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    transition: "background-color 0.2s",
                                                    "&:hover": {
                                                        backgroundColor: "#e0e0e0",
                                                    },
                                                }}
                                            >
                                                <ListItemAvatar>
                                                    <Avatar>
                                                        <CalendarMonthIcon/>
                                                    </Avatar>
                                                </ListItemAvatar>
                                                <Stack spacing={"0"}>
                                                    <ListItemText
                                                        primary={booking.name}
                                                        secondary={`${formatDate(booking.booking_start)} - ${formatDate(booking.booking_end)}`}/>
                                                    <ListItemText secondary={`${hardwareNames.join(", ")}`}/>
                                                </Stack>
                                            </ListItem>
                                        );
                                    }
                                )
                                }
                            </List>
                        ) : (
                            <Stack alignItems={"center"} spacing={2}>
                                <Typography variant={'subtitle1'}>Du hast noch keine Buchungen. Erstell doch
                                    eine!</Typography>
                                <DialogPopup dialogTitle={"Booking anlegen"} buttonName={"Booking anlegen"}>
                                    {
                                        bookingCreated ? <Typography>Buchung erstellt</Typography> :
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
        dispatch(fetchBookings())

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