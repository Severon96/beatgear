import React, {useEffect, useState} from "react";
import {isLoggedIn} from "../utils/auth";

export function ActiveBookings() {
    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        async function getIsLoggedIn() {
            const userIsLoggedIn = await isLoggedIn();

            setLoggedIn(userIsLoggedIn)
        }

        getIsLoggedIn()
    }, []);

    function displayBookings() {
        return (
            <div>
                <p>{`Bookings of user`}</p>
                <p>Current active bookings</p>
                <p>If there are none, why don&#39;t you book something?</p>
            </div>
        )
    }

    return (
        <div
            className="w-1/2 flex flex-col md:flex-row justify-between items-center py-1 px-2 md:mt-0 relative"
        >
            {
                loggedIn ? (
                    <p>{displayBookings()}</p>
                ) : (
                    <p>{`You aren't logged in`}</p>
                )
            }
        </div>
    );
}