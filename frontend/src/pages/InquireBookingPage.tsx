import * as React from 'react';
import {useContext} from 'react';
import {Alert, Card, Paper, Stack} from "@mui/material";
import Typography from "@mui/material/Typography";
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

    function formatDate(date: Date | null): string {
        const options: Intl.DateTimeFormatOptions = {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        };

        return date ? new Intl.DateTimeFormat("de-DE", options).format(date) : "";
    }

    function formatTime(date: Date | null): string {
        const options: Intl.DateTimeFormatOptions = {
            hour: "2-digit",
            minute: "2-digit",
        };

        return date ? new Intl.DateTimeFormat("de-DE", options).format(date) : "";
    }

    function renderCart() {
        return (
            <Stack direction={"row"} gap={2}>
                <Stack gap={2} width={"100%"}>
                    <Alert severity={"info"} color={"info"}>Die Einträge in deinem Warenkorb werden anhand des
                        Vermieters gruppiert.</Alert>
                    <Stack width={"100%"}>
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
                    </Stack>
                </Stack>
                <Stack gap={2}>
                    <Card>
                        <Stack>
                            <Typography variant={"h4"}>Deine Buchungs-Details</Typography>
                            <Divider sx={{marginY: 1}}/>
                            <Stack direction={"row"} gap={2}>
                                <Stack>
                                    <Typography fontWeight={"500"}>Von</Typography>
                                    <Typography
                                        fontWeight={"800"}>{formatDate(cartContext.bookingStart)}</Typography>
                                    <Typography>{formatTime(cartContext.bookingStart)}</Typography>
                                </Stack>
                                <Divider/>
                                <Stack>
                                    <Typography fontWeight={"500"}>Bis</Typography>
                                    <Typography fontWeight={"800"}>{formatDate(cartContext.bookingEnd)}</Typography>
                                    <Typography>{formatTime(cartContext.bookingEnd)}</Typography>
                                </Stack>
                            </Stack>
                        </Stack>
                    </Card>
                </Stack>
            </Stack>
        );
    }

    return (
        <>
            {
                cartContext.items.length > 0 ? renderCart() :
                    <Paper>
                        <Stack justifyContent={"center"}>
                            <Typography variant={"h3"}>Dein Warenkorb ist leer</Typography>
                        </Stack>
                    </Paper>
            }
        </>
    );
}