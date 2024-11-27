import * as React from 'react';
import {useContext, useEffect} from 'react';
import {isLoggedIn} from "../utils/auth";
import NotFoundErrorPage from "./NotFoundErrorPage";
import {useSelector} from "react-redux";
import {RootState, useAppDispatch, useAppSelector} from "../store";
import {Box, Button, Card, CardActions, CardContent, Paper, Stack} from "@mui/material";
import Typography from "@mui/material/Typography";
import {FloatingErrors} from "../components/FloatingErrors";
import {ErrorContext} from "../components/providers/ErrorProvider";
import {fetchInquiries} from "../redux-tk/slices/bookingSlice";
import {
    calculateHardwarePrice,
    calculateTotalBookingPrice,
    formatDateTime,
    getRoundedDaysDifference
} from "../utils/generalUtils";
import HideImageOutlinedIcon from "@mui/icons-material/HideImageOutlined";
import Divider from "@mui/material/Divider";


export default function InquiriesPage() {
    const {accessToken} = useSelector((state: RootState) => state.auth);
    const errorContext = useContext(ErrorContext);
    const {inquiriesStatus, inquiries} = useAppSelector((state) => state.bookings);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (inquiriesStatus === "failed") {
            errorContext.addError({message: "Laden der Anfragen fehlgeschlagen."})
        }

        if (inquiriesStatus === undefined) {
            dispatch(fetchInquiries())
        }
    }, [dispatch, inquiriesStatus, inquiries]);

    function renderInquiriesList() {
        return inquiries.map((inquiry) => {
            const bookingDays = getRoundedDaysDifference(inquiry.booking_start, inquiry.booking_end);
            const totalBookingPrice = calculateTotalBookingPrice(bookingDays, inquiry.hardware);

            return (
                <Card key={inquiry.id}>
                    <CardContent>
                        <Stack gap={2}>
                            <Stack flexDirection={"row"} justifyContent={"space-between"}>
                                <Typography variant={"h4"}>
                                    {`${formatDateTime(inquiry.booking_start)} - ${formatDateTime(inquiry.booking_end)}`}
                                </Typography>
                                <Typography fontWeight={700} fontSize={22}>
                                    {`${totalBookingPrice}€`}
                                </Typography>
                            </Stack>
                            <Divider/>
                            {inquiry.hardware.map((hardware) => {
                                const hardwareTotalPrice = calculateHardwarePrice(hardware.price_per_day, bookingDays)

                                return (
                                    <Card key={hardware.id}>
                                        <Stack flexDirection={"row"} gap={2} width={"100%"}>
                                            <Box sx={{paddingY: 2}} display={"flex"}
                                                 justifyContent={"center"}
                                                 height={"100%"}
                                                 alignItems={"center"}>
                                                <HideImageOutlinedIcon
                                                    sx={{transform: 'scale(2)'}}/>
                                            </Box>
                                            <Stack justifyContent={"space-between"} flexDirection={"row"}
                                                   width={"100%"}>
                                                <Stack justifyContent={"center"}>
                                                    <Typography variant={"h5"}>
                                                        {hardware.name}
                                                    </Typography>
                                                    {hardware.serial && hardware.serial !== "" && (
                                                        <Typography variant={"subtitle2"}>
                                                            {`Serien-Nummer: ${hardware.serial}`}
                                                        </Typography>
                                                    )
                                                    }
                                                </Stack>
                                                <Stack justifyContent={"center"}>
                                                    <Typography fontWeight={"700"}>
                                                        {`${hardwareTotalPrice}€`}
                                                    </Typography>
                                                </Stack>
                                            </Stack>
                                        </Stack>
                                    </Card>
                                )
                            })}
                        </Stack>
                    </CardContent>
                    <CardActions>
                        <Button>
                            Bearbeiten
                        </Button>
                    </CardActions>
                </Card>
            )
        });
    }

    function renderInquiriesPage() {
        const inquiryCount = inquiries ? inquiries.length : 0;
        return (
            <Paper>
                <Stack gap={2}>
                    <Typography
                        variant={"h2"}>{`Du hast aktuell ${inquiryCount} ${inquiryCount > 1 ? "Anfragen" : "Anfrage"}`}</Typography>
                    {
                        inquiries.length == 0 ? (
                            <Stack alignItems={"center"}>
                                <Typography variant={"body1"}>
                                    Keine Anfragen vorhanden.
                                </Typography>
                            </Stack>
                        ) : renderInquiriesList()
                    }

                    <FloatingErrors/>
                </Stack>
            </Paper>
        );
    }

    return isLoggedIn(accessToken) ? (
            <>
                {
                    renderInquiriesPage()
                }
            </>
        ) :
        <NotFoundErrorPage/>
        ;
}