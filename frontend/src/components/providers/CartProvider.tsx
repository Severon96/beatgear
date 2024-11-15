import React, {createContext, ReactNode, useEffect, useState} from 'react';
import {Hardware} from "../../models/Hardware";
import {cartContextDefault, CartContextType} from "../../models/Cart";

export const CartContext = createContext<CartContextType>(cartContextDefault);

interface CartProvider {
    children: ReactNode;
}

export const CartProvider: React.FC<CartProvider> = ({children}) => {
    const [items, setItems] = useState<Hardware[]>([]);
    const [bookingStart, setBookingStart] = useState<Date | null>(null);
    const [bookingEnd, setBookingEnd] = useState<Date | null>(null);

    useEffect(() => {
        const localStorageCartJson = localStorage.getItem('cart');
        const localStorageBookingStart = localStorage.getItem('bookingStart');
        const localStorageBookingEnd = localStorage.getItem('bookingEnd');

        const localStorageItems: Hardware[] = localStorageCartJson ? JSON.parse(localStorageCartJson) : [];
        const bookingStart: Date | null = localStorageBookingStart ? new Date(localStorageBookingStart) : null;
        const bookingEnd: Date | null = localStorageBookingEnd ? new Date(localStorageBookingEnd) : null;

        setItems(localStorageItems);
        setBookingStart(bookingStart);
        setBookingEnd(bookingEnd);
    }, [])

    const addCartItem = (item: Hardware) => {
        const newItems = [...items, item];
        setItems(newItems);
        localStorage.setItem('cart', JSON.stringify(newItems));
    };

    const removeCartItem = (item: Hardware) => {
        const filteredItems = items.filter(hardware => hardware.id !== item.id);
        setItems(filteredItems);
        localStorage.setItem('cart', JSON.stringify(filteredItems));
    };

    const isItemInCart = (hardware: Hardware) => {
        const cartIds = items.map((hardware) => hardware.id);

        return cartIds.includes(hardware.id);
    }

    const setBookingStartInCart = (date: Date | null) => {
        setBookingStart(date);
        localStorage.setItem('bookingStart', date?.toString() ?? "");
    }

    const setBookingEndInCart = (date: Date | null) => {
        setBookingEnd(date);
        localStorage.setItem('bookingEnd', date?.toString() ?? "");
    }

    return (
        <CartContext.Provider value={{
            items,
            bookingStart,
            bookingEnd,
            addCartItem,
            removeCartItem,
            isItemInCart,
            setBookingStartInCart,
            setBookingEndInCart
        }}>
            {children}
        </CartContext.Provider>
    );
};
