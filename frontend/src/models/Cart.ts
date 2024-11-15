import {Hardware} from "./Hardware";

export interface CartContextType {
    items: Hardware[];
    addCartItem: (item: Hardware) => void;
    removeCartItem: (item: Hardware) => void;
    isItemInCart: (item: Hardware) => boolean;
}

export const cartContextDefault: CartContextType = {
    items: [],
    addCartItem: (item: Hardware) => console.log(item),
    removeCartItem: (item: Hardware) => console.log(item),
    isItemInCart: (item: Hardware) => Boolean(item),
}