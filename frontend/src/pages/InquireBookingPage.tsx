import * as React from 'react';
import {useContext, useEffect} from 'react';
import {Alert, AlertTitle, Box, Button, Card, CardMedia, Paper, Stack} from "@mui/material";
import Typography from "@mui/material/Typography";
import {CartContext} from "../components/providers/CartProvider";
import {getReadableCategory} from "../models/Hardware";
import Divider from "@mui/material/Divider";
import RemoveShoppingCartIcon from "@mui/icons-material/RemoveShoppingCart";
import IconButton from "@mui/material/IconButton";
import HideImageOutlinedIcon from '@mui/icons-material/HideImageOutlined';
import {
    byteArrayToDataUrl,
    formatDate,
    formatPrice,
    formatTime,
    getRoundedDaysDifference,
    groupByOwnerId
} from "../utils/generalUtils";
import {ErrorContext} from "../components/providers/ErrorProvider";
import {RootState, useAppDispatch, useAppSelector} from "../store";
import {inquireBooking} from "../redux-tk/slices/bookingSlice";
import {v4 as uuid} from "uuid";
import {jwtDecode} from "jwt-decode";
import {useSelector} from "react-redux";
import {isLoggedIn} from "../utils/auth";
import NotFoundErrorPage from "./NotFoundErrorPage";
import {useNavigate} from "react-router-dom";
import {FloatingErrors} from "../components/FloatingErrors";

export default function InquireBookingPage() {
    const inquiryStatus = useAppSelector((state) => state.bookings.inquireBookingStatus);
    const createdBookingInquiry = useAppSelector((state) => state.bookings.createdBookingInquiry);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const cartContext = useContext(CartContext);
    const errorContext = useContext(ErrorContext);
    const {accessToken} = useSelector((state: RootState) => state.auth);

    let decodedToken: { sub: string };
    if (accessToken) {
        decodedToken = jwtDecode(accessToken ?? "");
    }

    const roundedDays = getRoundedDaysDifference(cartContext.bookingStart, cartContext.bookingEnd);

    const rawItemPrice = cartContext.items.reduce((sum, item) => sum + item.price_per_day, 0);
    const totalAmount = roundedDays * rawItemPrice;

    useEffect(() => {
        if (inquiryStatus === "failed") {
            errorContext.addError({
                message: "Anfrage konnte nicht erstellt werden."
            })
        }
    }, [navigate, inquiryStatus, createdBookingInquiry])

    function createBookingInquiry() {
        if (cartContext.bookingStart && cartContext.bookingEnd) {
            const hardwareIds = cartContext.items.map((hardware) => hardware.id);
            dispatch(inquireBooking(
                {
                    id: uuid(),
                    customer_id: decodedToken ? decodedToken.sub : "",
                    hardware_ids: hardwareIds,
                    booking_start: cartContext.bookingStart,
                    booking_end: cartContext.bookingEnd,
                    total_booking_days: roundedDays,
                    total_amount: totalAmount,
                    author_id: decodedToken.sub
                }
            ))
        } else {
            errorContext.addError({
                message: "Keine Buchungsdaten ausgewählt, Buchung kann nicht angefragt werden."
            })
        }
    }

    function renderCart() {
        return inquiryStatus === "succeeded" ? renderSuccessPage() : (
            <Stack direction={{md: "row", xs: "column"}} gap={2}>
                <Stack gap={2} width={"100%"}>
                    <Alert severity={"info"} color={"info"}>
                        <Typography variant={"subtitle2"} textAlign={"center"}>Die Einträge in deinem Warenkorb
                            werden
                            anhand des
                            Vermieters gruppiert, falls du von mehreren Anbietern buchst.</Typography>
                    </Alert>
                    <Stack width={"100%"}>
                        {
                            Array.from(groupByOwnerId(cartContext.items).entries()).map(([ownerId, hardwareArray]) => {
                                return (
                                    <Card key={ownerId}>
                                        {
                                            hardwareArray.map((hardware, index) => {
                                                return (
                                                    <Stack key={hardware.id}>
                                                        <Stack direction="row" alignItems={"center"}
                                                               justifyContent="space-between">
                                                            <Stack direction={"row"} alignItems={"center"} gap={2}>
                                                                {
                                                                    hardware.image ? (
                                                                            <CardMedia
                                                                                component="img"
                                                                                image={byteArrayToDataUrl(hardware.image)}
                                                                                alt="Image"
                                                                                sx={{width: '100%', height: 'auto'}}
                                                                            />
                                                                        ) :
                                                                        <Box sx={{paddingY: 2}} display={"flex"}
                                                                             justifyContent={"center"}
                                                                             height={"100%"}
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
                                                        {index < hardwareArray.length - 1 && <Divider/>}
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
                                    <Typography>{`${formatTime(cartContext.bookingStart)} Uhr`}</Typography>
                                </Stack>
                                <Divider/>
                                <Stack>
                                    <Typography fontWeight={"500"}>Bis</Typography>
                                    <Typography fontWeight={"800"}>{formatDate(cartContext.bookingEnd)}</Typography>
                                    <Typography>{`${formatTime(cartContext.bookingEnd)} Uhr`}</Typography>
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
                                    <Typography variant={"subtitle2"}>Der Preis ist nicht verbindlich. Die
                                        endgültige
                                        Entscheidung liegt beim
                                        Vermieter.</Typography>
                                    <Typography variant={"subtitle2"}>Sollte es ein Gegenangebot geben, wirst du
                                        informiert.</Typography>
                                </Alert>
                                <Button variant="contained" color="primary" onClick={createBookingInquiry}>
                                    <Typography fontWeight={700} color={"common.white"}>Buchung anfragen</Typography>
                                </Button>
                            </Stack>
                        </Stack>
                    </Card>
                </Stack>
                <FloatingErrors/>
            </Stack>
        );
    }

    function renderSuccessPage() {
        return (
            <Stack>
                <Alert severity={"success"} action={
                    <Button href={"/"}>
                        Zurück zum Dashboard
                    </Button>
                }>
                    <Stack justifyContent={"center"} alignContent={"center"} alignItems={"center"}>
                        <AlertTitle>Deine Buchung wurde angefragt</AlertTitle>
                    </Stack>
                </Alert>
            </Stack>
        )
    }

    function renderEmptyCart() {
        return <Paper>
            <Stack justifyContent={"center"}>
                <Typography variant={"h3"}>Dein Warenkorb ist leer</Typography>
            </Stack>
        </Paper>;
    }

    return isLoggedIn(accessToken) ? (
        <>
            {
                cartContext.items.length > 0 ? renderCart() :
                    renderEmptyCart()
            }
        </>
    ) : <NotFoundErrorPage/>;
}