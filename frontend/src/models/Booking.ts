import {Hardware} from "./Hardware";

export type BookingsStatus = "succeeded" | "loading" | "failed";

export type Booking = {
    id: string | null;
    name: string;
    customerId: string | null;
    bookingStart: Date | null;
    bookingEnd: Date | null;
    authorId: string | null;
    hardware: Hardware[];
    createdAt: Date;
    updatedAt: Date;
}

export type BookingRequest = {
    id: string | null;
    name: string | null;
    customerId: string | null;
    hardwareIds: string[];
    bookingStart: Date | null;
    bookingEnd: Date | null;
    authorId: string | null;
    totalBookingDays: number;
    totalAmount: number;
};

