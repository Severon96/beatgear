import {format} from "date-fns";
import {Hardware} from "../models/Hardware";

export function formatDateTime(date: Date | null): string {
    return date ? format(date, 'dd.MM.yyyy HH:mm') : "";
}

export function formatDate(date: Date | null): string {
    const options: Intl.DateTimeFormatOptions = {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    };

    return date ? new Intl.DateTimeFormat("de-DE", options).format(date) : "";
}

export function formatTime(date: Date | null): string {
    const options: Intl.DateTimeFormatOptions = {
        hour: "2-digit",
        minute: "2-digit",
    };

    return date ? new Intl.DateTimeFormat("de-DE", options).format(date) : "";
}

export const formatPrice = (num: number): string => {
    return new Intl.NumberFormat("de-DE", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(num);
};

export const calculateHardwarePrice = (hardwarePrice: number, bookingDuration: number): string => {
    return formatPrice(hardwarePrice * bookingDuration)
}

export const calculateTotalBookingPrice = (bookingDuration: number, hardware: Hardware[]): string => {
    return formatPrice(hardware.reduce((sum, hardware) => sum + hardware.price_per_day, 0) * bookingDuration)
}

export const byteArrayToDataUrl = (byteArray: Uint8Array): string => {
    const blob = new Blob([byteArray], {type: 'image/png'});
    return URL.createObjectURL(blob);
};

export const getRoundedDaysDifference = (bookingStart: Date | string | null, bookingEnd: Date | string | null): number => {
    if (bookingStart && bookingEnd) {
        bookingStart = typeof bookingStart == "string" ? new Date(Date.parse(bookingStart)) : bookingStart;
        bookingEnd = typeof bookingEnd == "string" ? new Date(Date.parse(bookingEnd)) : bookingEnd;

        const diffInMillis = Math.abs(bookingEnd.getTime() - bookingStart.getTime());
        const oneDayInMillis = 24 * 60 * 60 * 1000;
        const diffInDays = diffInMillis / oneDayInMillis;

        return Math.ceil(diffInDays);
    }

    return 1;
};

export function groupByOwnerId(hardwareArray: Hardware[]): Map<string, Hardware[]> {
    return hardwareArray.reduce((result, item) => {
        const ownerId = item.ownerId;

        if (!result.has(ownerId)) {
            result.set(ownerId, []);
        }

        result.get(ownerId)?.push(item);

        return result;
    }, new Map<string, Hardware[]>());
}