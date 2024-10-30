import {Hardware} from "./Hardware";

export type BookingsStatus = "succeeded" | "loading" | "failed";

export type Booking = {
    id: string | null;
    name: string;
    customer_id: string | null;
    booking_start: Date | null;
    booking_end: Date | null;
    author_id: string | null;
    hardware: Hardware[];
    created_at: Date;
    updated_at: Date;
}

export type BookingRequest = {
    id: string | null;
    name: string | null;
    customer_id: string | null;
    hardware_ids: string[];
    booking_start: Date | null;
    booking_end: Date | null;
    author_id: string | null;
};
