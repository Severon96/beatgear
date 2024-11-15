import React, {createContext, ReactNode, useEffect, useState} from 'react';
import {Hardware} from "../../models/Hardware";
import {cartContextDefault, CartContextType} from "../../models/Cart";

export const CartContext = createContext<CartContextType>(cartContextDefault);

interface CartProvider {
    children: ReactNode;
}

export const CartProvider: React.FC<CartProvider> = ({children}) => {
    const [items, setItems] = useState<Hardware[]>([]);

    useEffect(() => {
        const localStorageItems: Hardware[] = JSON.parse(localStorage.getItem('cart') ?? "[]");
        setItems(localStorageItems);
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

    return (
        <CartContext.Provider value={{items, addCartItem, removeCartItem, isItemInCart}}>
            {children}
        </CartContext.Provider>
    );
};
