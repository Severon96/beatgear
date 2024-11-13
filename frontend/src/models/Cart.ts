import {Hardware} from "./Hardware";

export interface CartContextType {
    items: Hardware[];
    addCartItem: (item: Hardware) => void;
}

export const cartContextDefault: CartContextType = {
    items: [],
    addCartItem: (item: Hardware) => console.log(item)
}