import {format} from "date-fns";

export function formatDate(date: Date | null): string {
    return date ? format(date, 'dd.MM.yyyy HH:mm') : "";
}