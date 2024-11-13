import React, {createContext, ReactNode, useState} from 'react';
import {Hardware} from "../../models/Hardware";
import {cartContextDefault, CartContextType} from "../../models/Cart";

export const CartContext = createContext<CartContextType>(cartContextDefault);

interface CartProvider {
    children: ReactNode;
}

export const CartProvider: React.FC<CartProvider> = ({children}) => {
    const [items, setItems] = useState<Hardware[]>([]);

    const addCartItem = (item: Hardware) => {
        setItems((prevItems) => [...prevItems, item]);
    };

    return (
        <CartContext.Provider value={{items, addCartItem}}>
            {children}
        </CartContext.Provider>
    );
};
