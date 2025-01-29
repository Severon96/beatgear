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
import EditIcon from '@mui/icons-material/Edit';
import IconButton from "@mui/material/IconButton";

interface BookingCardProps {
    booking: Booking;
}

export const BookingCard: React.FC<BookingCardProps> = ({booking}) => {
    const bookingDays = getRoundedDaysDifference(booking.bookingStart, booking.bookingEnd);
    const totalBookingPrice = calculateTotalBookingPrice(bookingDays, booking.hardware);

    return (
        <Stack>
            <Stack gap={2}>
                <Stack flexDirection={"row"} justifyContent={"space-between"}>
                    <Typography variant={"h4"}>
                        {`${formatDateTime(booking.bookingStart)} - ${formatDateTime(booking.bookingEnd)}`}
                    </Typography>
                </Stack>
                <Divider/>
                <List>
                    {booking.hardware.map((hardware) => {
                        const hardwareTotalPrice = calculateHardwarePrice(hardware.pricePerDay, bookingDays)

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
                <Stack flexDirection={"row"} justifyContent={"end"}>
                    <Typography fontWeight={700} fontSize={22}>
                        {`${totalBookingPrice}€`}
                    </Typography>
                </Stack>
            </Stack>
        </Stack>
    )
}