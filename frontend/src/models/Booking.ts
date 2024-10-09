import {UUID} from "node:crypto";

export type Booking = {
    id: UUID;
    name: string;
    customer_id: UUID;
    booking_start: Date;
    booking_end: Date;
    author_id: UUID;
    created_at: Date;
    updated_at: Date;
}