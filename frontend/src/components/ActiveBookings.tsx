import React, {useContext, useEffect, useState} from "react";
import {getActiveUserBookings} from "../clients/booking-client";
import {Booking} from "../models/Booking";
import Box from "@mui/material/Box";
import {Card, CardHeader} from "@mui/material";
import Typography from "@mui/material/Typography";
import {ErrorContext} from "./providers/ErrorProvider";

export function ActiveBookings() {
    const [activeBookings, setActiveBookings] = useState<Booking[]>([]);
    const errorContext = useContext(ErrorContext);

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
        async function setBookings() {
            try {
                const bookings = await getActiveUserBookings();

                setActiveBookings(bookings);
            } catch (e) {
                const error = e as Error;

                errorContext.addError({message: error.message})
            }
        }

        setBookings();
    }, []);

    return (
        <Box>
            { displayBookings() }
        </Box>
    );
}