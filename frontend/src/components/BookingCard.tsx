import * as React from "react";
import {Box, Button, List, ListItem, Stack} from "@mui/material";
import Typography from "@mui/material/Typography";
import {
    calculateHardwarePrice,
    calculateTotalBookingPrice,
    formatDateTime,
    getRoundedDaysDifference
} from "../utils/generalUtils";
import Divider from "@mui/material/Divider";
import HideImageOutlinedIcon from "@mui/icons-material/HideImageOutlined";
import {Booking} from "../models/Booking";

interface BookingCardProps {
    booking: Booking;
}

export const BookingCard: React.FC<BookingCardProps> = ({booking}) => {
    const bookingDays = getRoundedDaysDifference(booking.booking_start, booking.booking_end);
    const totalBookingPrice = calculateTotalBookingPrice(bookingDays, booking.hardware);

    return (
        <Stack>
            <Stack gap={2}>
                <Stack flexDirection={"row"} justifyContent={"space-between"}>
                    <Typography variant={"h4"}>
                        {`${formatDateTime(booking.booking_start)} - ${formatDateTime(booking.booking_end)}`}
                    </Typography>
                    <Typography fontWeight={700} fontSize={22}>
                        {`${totalBookingPrice}€`}
                    </Typography>
                </Stack>
                <Divider/>
                <List>
                    {booking.hardware.map((hardware) => {
                        const hardwareTotalPrice = calculateHardwarePrice(hardware.price_per_day, bookingDays)

                        return (
                            <ListItem key={hardware.id} alignItems={"flex-start"}>
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
                            </ListItem>
                        )
                    })}
                </List>
            </Stack>
            <Stack alignItems={"start"}>
                <Button>
                    Bearbeiten
                </Button>
            </Stack>
        </Stack>
    )
}