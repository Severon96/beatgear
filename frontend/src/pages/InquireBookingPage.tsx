import * as React from 'react';
import {Card, Paper} from "@mui/material";
import Typography from "@mui/material/Typography";
import {useContext} from "react";
import {CartContext} from "../components/providers/CartProvider";
import {Hardware} from "../models/Hardware";
import Divider from "@mui/material/Divider";

export default function InquireBookingPage() {
    const cartContext = useContext(CartContext);

    function groupByOwnerId(hardwareArray: Hardware[]): Map<string, Hardware[]> {
        return hardwareArray.reduce((result, item) => {
            const ownerId = item.ownerId;

            if (!result.has(ownerId)) {
                result.set(ownerId, []);
            }

            result.get(ownerId)?.push(item);

            return result;
        }, new Map<string, Hardware[]>());
    }

    return (
        <Paper>
            <Typography variant={"h1"}>Buchung anfragen</Typography>
            {
                Array.from(groupByOwnerId(cartContext.items).entries()).map(([ownerId, hardwareArray]) => {
                    return (
                        <Card key={ownerId}>
                            {
                                hardwareArray.map((hardware) => {
                                    return (
                                        <>
                                            <Typography key={hardware.id}>{hardware.name}</Typography>
                                            <Divider/>
                                        </>
                                    )
                                })
                            }
                        </Card>
                    )
                })
            }
        </Paper>
    );
}