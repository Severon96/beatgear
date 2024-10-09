import React, {useEffect, useState} from "react";
import {isLoggedIn} from "../utils/auth";
import {getActiveUserBookings} from "../clients/booking-client";
import {Booking} from "../models/Booking";

export function ActiveBookings() {
    const [loggedIn, setLoggedIn] = useState(false);
    const [activeBookings, setActiveBookings] = useState<Booking[]>([]);

    function displayBookings() {
        return (
            <div>
                {
                    activeBookings.length > 0 ? (
                        <div>
                            <p>{`Bookings of user`}</p>
                            <p>Current active bookings</p>
                        </div>
                    ) : (
                        <p>If there are none, why don&#39;t you book something?</p>
                    )
                }

            </div>
        )
    }

    useEffect(() => {
        async function getIsLoggedIn() {
            const userIsLoggedIn = await isLoggedIn();

            setLoggedIn(userIsLoggedIn);
        }

        async function setBookings() {
            const bookings = await getActiveUserBookings();

            setActiveBookings(bookings);
        }

        getIsLoggedIn();
        setBookings();
    }, []);

    return (
        <div
            className="w-1/2 flex flex-col md:flex-row justify-between items-center py-1 px-2 md:mt-0 relative"
        >
            {
                loggedIn ? displayBookings() : (
                    <p>{`You aren't logged in`}</p>
                )
            }
        </div>
    );
}