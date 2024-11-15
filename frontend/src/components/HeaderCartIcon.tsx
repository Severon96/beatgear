import * as React from 'react';
import {useContext, useState} from 'react';
import {CartContext} from "./providers/CartProvider";
import {Badge, Box, Button, Popover} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import {useSelector} from "react-redux";
import {RootState} from "../store";
import {isLoggedIn} from "../utils/auth";
import Typography from "@mui/material/Typography";

export default function HeaderCartIcon() {
    const {accessToken} = useSelector((state: RootState) => state.auth);
    const cartContext = useContext(CartContext);
    const loggedIn = isLoggedIn(accessToken);
    const [cartOpen, setCartOpen] = useState<null | HTMLElement>(null);

    const handleCartClick = (event: React.MouseEvent<HTMLElement>) => {
        setCartOpen(cartOpen ? null : event.currentTarget);
    };

    const handleCartClose = () => {
        setCartOpen(null);
    };

    const isCartOpen = Boolean(cartOpen);

    return (
        <>
            {
                loggedIn && (
                    <Badge badgeContent={cartContext.items.length} color="error">
                        <IconButton sx={{color: "common.black"}} aria-label="shopping-cart" onClick={handleCartClick}>
                            <ShoppingCartIcon/>
                        </IconButton>
                    </Badge>
                )
            }
            <Popover
                open={isCartOpen}
                anchorEl={cartOpen}
                onClose={handleCartClose}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center",
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "center",
                }}
            >
                <Box sx={{p: 2, width: 300}}>
                    <Typography variant="h2" gutterBottom>
                        Warenkorb
                    </Typography>
                    {cartContext.items.length > 0 ? (
                        <Box
                            width="100%"
                            display={"flex"}
                            flexDirection={"column"}
                            justifyContent={"center"}
                            alignItems={"center"}
                            gap={2}
                        >
                            <Box
                                width="100%"
                                display={"flex"}
                                flexDirection={"column"}
                                justifyContent={"center"}
                            >
                                {
                                    cartContext.items.map((item, index) => (
                                        <Typography key={index}>{item.name}</Typography>
                                    ))
                                }
                            </Box>
                            <Button href={"request-booking"} variant="contained" color="primary" type="submit">
                                Buchung anfragen
                            </Button>
                        </Box>
                    ) : (
                        <Typography variant="body2">Ihr Warenkorb ist leer.</Typography>
                    )}
                </Box>
            </Popover>
        </>
    );
}