import {Hardware} from "./Hardware";

export interface CartContextType {
    items: Hardware[];
    bookingStart: Date | null;
    bookingEnd: Date | null;
    addCartItem: (item: Hardware) => void;
    removeCartItem: (item: Hardware) => void;
    isItemInCart: (item: Hardware) => boolean;
    setBookingStartInCart: (date: Date | null) => void;
    setBookingEndInCart: (date: Date | null) => void;
}

export const cartContextDefault: CartContextType = {
    items: [],
    bookingStart: null,
    bookingEnd: null,
    addCartItem: (item: Hardware) => console.log(item),
    removeCartItem: (item: Hardware) => console.log(item),
    isItemInCart: (item: Hardware) => Boolean(item),
    setBookingStartInCart: (date: Date | null) => console.log(date),
    setBookingEndInCart: (date: Date | null) => console.log(date),
}