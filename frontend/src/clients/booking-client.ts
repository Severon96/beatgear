import {Booking} from "../models/Booking";

export async function getActiveUserBookings(): Promise<Booking[]> {
    const backendUrl = `${process.env.REACT_APP_BACKEND_URL}/api/bookings/active`

    const response = await fetch(backendUrl, {
        method: 'GET',
    });

    if (!response.ok) {
        throw new Error("Failed to get active bookings");
    }

    return await response.json() as Booking[];
}