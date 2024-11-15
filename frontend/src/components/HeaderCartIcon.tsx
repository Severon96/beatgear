import * as React from 'react';
import {useContext, useState} from 'react';
import {CartContext} from "./providers/CartProvider";
import {Badge, Button, Popover, Stack} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import {useSelector} from "react-redux";
import {RootState} from "../store";
import {isLoggedIn} from "../utils/auth";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";

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
                <Stack sx={{p: 2, width: 300}} gap={1}>
                    <Typography variant="h2">
                        Warenkorb
                    </Typography>
                    <Divider/>
                    {cartContext.items.length > 0 ? (
                        <Stack
                            width="100%"
                            justifyContent={"center"}
                            alignItems={"center"}
                            gap={2}
                        >
                            <Stack
                                width="100%"
                                justifyContent={"center"}
                            >
                                {
                                    cartContext.items.map((item, index) => (
                                        <Stack key={index} direction={"row"} justifyContent={"space-between"}
                                               alignItems={"center"}>
                                            <Typography>{item.name}</Typography>
                                            <Typography>{`${item.price_per_day}€/Tag`}</Typography>
                                        </Stack>
                                    ))
                                }
                            </Stack>
                            <Button href={"request-booking"} variant="contained" color="primary" type="submit">
                                <Typography fontWeight={550} color={"common.white"}>Buchung anfragen</Typography>
                            </Button>
                        </Stack>
                    ) : (
                        <Typography variant="body2">Ihr Warenkorb ist leer.</Typography>
                    )}
                </Stack>
            </Popover>
        </>
    );
}