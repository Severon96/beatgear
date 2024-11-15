import * as React from 'react';
import {useContext} from 'react';
import {Alert, Box, Button, Card, Paper, Stack} from "@mui/material";
import Typography from "@mui/material/Typography";
import {CartContext} from "../components/providers/CartProvider";
import {getReadableCategory, Hardware} from "../models/Hardware";
import Divider from "@mui/material/Divider";
import RemoveShoppingCartIcon from "@mui/icons-material/RemoveShoppingCart";
import IconButton from "@mui/material/IconButton";
import HideImageOutlinedIcon from '@mui/icons-material/HideImageOutlined';

export default function InquireBookingPage() {
    const cartContext = useContext(CartContext);

    const getRoundedDaysDifference = () => {
        if (cartContext.bookingStart && cartContext.bookingEnd) {
            const diffInMillis = Math.abs(cartContext.bookingEnd.getTime() - cartContext.bookingStart.getTime());
            const oneDayInMillis = 24 * 60 * 60 * 1000;
            const diffInDays = diffInMillis / oneDayInMillis;

            return Math.round(diffInDays);
        }

        return 1;
    };

    const roundedDays = getRoundedDaysDifference();

    const rawItemPrice = cartContext.items.reduce((sum, item) => sum + item.price_per_day, 0);
    const totalAmount = roundedDays * rawItemPrice;

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
                    <Alert severity={"info"} color={"info"}>
                        <Typography variant={"subtitle2"} textAlign={"center"}>Die Einträge in deinem Warenkorb werden
                            anhand des
                            Vermieters gruppiert, falls du von mehreren Anbietern buchst.</Typography>
                    </Alert>
                    <Stack width={"100%"}>
                        {
                            Array.from(groupByOwnerId(cartContext.items).entries()).map(([ownerId, hardwareArray]) => {
                                return (
                                    <Card key={ownerId}>
                                        {
                                            hardwareArray.map((hardware) => {
                                                return (
                                                    <Stack key={hardware.id}>
                                                        <Stack direction="row" alignItems={"center"}
                                                               justifyContent="space-between">
                                                            <Stack direction={"row"} alignItems={"center"} gap={2}>
                                                                {
                                                                    hardware.image ? (
                                                                            <Typography>Test</Typography>
                                                                        ) :
                                                                        <Box sx={{paddingY: 2}} display={"flex"}
                                                                             justifyContent={"center"} height={"100%"}
                                                                             alignItems={"center"}>
                                                                            <HideImageOutlinedIcon
                                                                                sx={{transform: 'scale(2)'}}/>
                                                                        </Box>
                                                                }
                                                                <Stack>

                                                                    <Typography
                                                                        variant={"subtitle2"}>{getReadableCategory(hardware.category)}</Typography>
                                                                    <Typography>{hardware.name}</Typography>
                                                                </Stack>
                                                            </Stack>
                                                            <Stack direction={"row"} gap={1} alignItems={"center"}>
                                                                <Typography>{`${formatPrice(hardware.price_per_day)}€/Tag`}</Typography>
                                                                <IconButton
                                                                    color="inherit"
                                                                    aria-label="remove from cart"
                                                                    edge="start"
                                                                    onClick={() => cartContext.removeCartItem(hardware)}
                                                                    sx={{width: 60, borderRadius: "20%"}}
                                                                >
                                                                    <RemoveShoppingCartIcon/>
                                                                </IconButton>
                                                            </Stack>
                                                        </Stack>
                                                        <Divider/>
                                                    </Stack>
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
                            <Alert severity={"info"}>
                                <Typography
                                    variant={"subtitle2"}>
                                    {`Buchungsdauer: ${roundedDays} ${roundedDays == 1 ? "Tag" : "Tage"}`}
                                </Typography>
                            </Alert>
                        </Stack>
                    </Card>
                    <Card>
                        <Stack gap={1}>
                            <Typography variant={"h4"}>Deine Preis-Zusammenfassung</Typography>
                            <Divider/>
                            <Stack gap={2}>
                                <Stack direction={"row"} justifyContent={"space-between"}>
                                    <Typography>Summe</Typography>
                                    <Typography>{`${formatPrice(totalAmount)}€`}</Typography>
                                </Stack>
                                <Alert
                                    severity={"info"}>
                                    <Typography variant={"subtitle2"}>Der Preis ist nicht verbindlich. Die endgültige
                                        Entscheidung liegt beim
                                        Vermieter.</Typography>
                                    <Typography variant={"subtitle2"}>Sollte es ein Gegenangebot geben, wirst du
                                        informiert.</Typography>
                                </Alert>
                                <Button variant="contained" color="primary">
                                    <Typography fontWeight={700} color={"common.white"}>Jetzt buchen</Typography>
                                </Button>
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