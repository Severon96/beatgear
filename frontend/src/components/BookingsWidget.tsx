import React, {useEffect} from "react";
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
import {fetchBookings} from "../redux-tk/slices/bookingSlice";
import {useAppDispatch, useAppSelector} from "../store";
import Typography from "@mui/material/Typography";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import {formatDate} from "../utils/generalUtils";

export function BookingsWidget() {
    const dispatch = useAppDispatch();
    const activeBookings = useAppSelector(state => state.bookings.activeBookings)

    function displayBookings() {
        return (
            <Card>
                <CardHeader title={"Buchungen"}/>
                <CardContent>
                    {
                        activeBookings.length > 0 ? (
                            <List>
                                {activeBookings.map((booking) => {
                                        const hardwareNames = booking.hardware.map((hardware) => hardware.name);

                                        return (
                                            <ListItem
                                                key={booking.id}
                                                sx={{
                                                    border: "1px solid #ddd",
                                                    borderRadius: "8px",
                                                    backgroundColor: "#f9f9f9",
                                                    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
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
                                <Typography variant={'subtitle1'}>Du hast noch keine Buchungen.</Typography>
                            </Stack>
                        )
                    }
                </CardContent>
            </Card>
        )
    }

    useEffect(() => {
        dispatch(fetchBookings())
    }, [dispatch]);

    return (
        <Box>
            {displayBookings()}
        </Box>
    );
}