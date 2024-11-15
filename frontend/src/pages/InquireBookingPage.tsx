import * as React from 'react';
import {useContext} from 'react';
import {Alert, Box, Card, Paper, Stack} from "@mui/material";
import Typography from "@mui/material/Typography";
import {CartContext} from "../components/providers/CartProvider";
import {Hardware} from "../models/Hardware";
import Divider from "@mui/material/Divider";

export default function InquireBookingPage() {
    const cartContext = useContext(CartContext);
    const totalAmount = cartContext.items.reduce((sum, item) => sum + item.price_per_day, 0);

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

    const formatPrice = (num: number): string => {
        return new Intl.NumberFormat("de-DE", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(num);
    };

    function renderCart() {
        return (
            <Stack direction={{md: "row", xs: "column"}} gap={2}>
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
                                                    <Box key={hardware.id}>
                                                        <Typography>{hardware.name}</Typography>
                                                        <Divider/>
                                                    </Box>
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
                        <Stack gap={1}>
                            <Typography variant={"h4"}>Deine Buchungs-Details</Typography>
                            <Divider/>
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
                    <Card>
                        <Stack gap={1}>
                            <Typography variant={"h4"}>Deine Preis-Zusammenfassung</Typography>
                            <Divider/>
                            <Stack gap={2}>
                                <Stack direction={"row"} justifyContent={"space-between"}>
                                    <Typography>Summe</Typography>
                                    <Typography>{`${formatPrice(totalAmount)}€/Tag`}</Typography>
                                </Stack>
                                <Alert
                                    severity={"info"}>
                                    <Typography>Der Preis ist nicht verbindlich. Die endgültige Entscheidung liegt beim
                                        Vermieter.</Typography>
                                    <Typography>Sollte es ein Gegenangebot geben, wirst du informiert.</Typography>
                                </Alert>
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