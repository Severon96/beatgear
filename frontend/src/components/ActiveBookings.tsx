import React, {useEffect} from "react";
import Box from "@mui/material/Box";
import {Card, CardContent, CardHeader, Stack} from "@mui/material";
import {fetchActiveBookings} from "../redux-tk/slices/bookingSlice";
import {useAppDispatch, useAppSelector} from "../store";
import Typography from "@mui/material/Typography";
import {Popup} from "./Popup";

export function ActiveBookings() {
    const dispatch = useAppDispatch();
    const activeBookings = useAppSelector(state => state.bookings.activeBookings)

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
                                <Popup buttonName={"Booking anlegen"}>
                                    <Typography>Popup Inhalt</Typography>
                                </Popup>
                            </Stack>
                        )
                    }
                </CardContent>
            </Card>
        )
    }

    useEffect(() => {
        dispatch(fetchActiveBookings())
    }, [dispatch]);

    return (
        <Box>
            {displayBookings()}
        </Box>
    );
}