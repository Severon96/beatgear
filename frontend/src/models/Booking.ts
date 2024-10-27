export type Booking = {
    id: string | null;
    name: string;
    customer_id: string | null;
    booking_start: Date | null;
    booking_end: Date | null;
    author_id: string | null;
    created_at: Date;
    updated_at: Date;
}

export type BookingRequest = {
    id: string | null;
    name: string | null;
    customerId: string | null;
    hardwareIds: string[];
    bookingStart: Date | null;
    bookingEnd: Date | null;
    authorId: string | null;
};
