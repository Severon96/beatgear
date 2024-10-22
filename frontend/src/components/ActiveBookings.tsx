import React, {useEffect, useState} from "react";
import {isLoggedIn} from "../utils/auth";
import {getActiveUserBookings} from "../clients/booking-client";
import {Booking} from "../models/Booking";
import Box from "@mui/material/Box";
import {Card, CardHeader} from "@mui/material";
import Typography from "@mui/material/Typography";

export function ActiveBookings() {
    const [loggedIn, setLoggedIn] = useState(false);
    const [activeBookings, setActiveBookings] = useState<Booking[]>([]);

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
        async function getIsLoggedIn() {
            const userIsLoggedIn = await isLoggedIn();

            setLoggedIn(userIsLoggedIn);
        }

        async function setBookings() {
            try {
                const bookings = await getActiveUserBookings();

                setActiveBookings(bookings);
            } catch (e) {
                console.error(e);
            }
        }

        getIsLoggedIn();
        setBookings();
    }, []);

    return (
        <Box>
            {
                loggedIn ? displayBookings() : (
                    <p>{`You aren't logged in`}</p>
                )
            }
        </Box>
    );
}