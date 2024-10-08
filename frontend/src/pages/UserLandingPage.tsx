import React from "react";
import {ActiveBookings} from "../components/active-bookings";

export function UserLandingPage() {
    return (
        <div
            className="flex flex-col items-center justify-items-center min-h-screen pb-20 gap-16 font-[family-name:var(--font-geist-sans)] overflow-x-hidden relative">
            <ActiveBookings />
        </div>
    );
}