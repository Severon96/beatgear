import React, {useEffect} from "react";
import Box from "@mui/material/Box";
import {Card, CardHeader} from "@mui/material";
import {fetchActiveBookings} from "../redux-tk/slices/bookingSlice";
import {useAppDispatch, useAppSelector} from "../store";
import Typography from "@mui/material/Typography";

export function ActiveBookings() {
    const dispatch = useAppDispatch();
    const activeBookings = useAppSelector(state => state.bookings.activeBookings)

    function displayBookings() {
        return (
            <Card>
                <CardHeader title={"Buchungen"}/>
                {
                    activeBookings.length > 0 ? (
                        <Box>
                            <p>{`Bookings of user`}</p>
                            <p>Current active bookings</p>
                        </Box>
                    ) : (
                        <Typography variant={'body1'}>You have no bookings, feel free to create one!</Typography>
                    )
                }

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