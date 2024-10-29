import React, {useState} from 'react';
import {Box, Button, Stack} from '@mui/material';
import {BookingRequest} from "../models/Booking";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import {LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFnsV3";
import {useSelector} from "react-redux";
import {RootState, useAppDispatch} from "../store";
import {de} from "date-fns/locale";
import HardwareSelect from "./HardwareSelect";
import {fetchHardware} from "../redux-tk/slices/hardwareSlice";

export const BookingForm: React.FC = () => {
    const dispatch = useAppDispatch();
    const {accessToken} = useSelector((state: RootState) => state.auth);
    const [booking, setBooking] = useState<BookingRequest>({
        id: null,
        name: '',
        customerId: accessToken,
        hardwareIds: [],
        bookingStart: null,
        bookingEnd: null,
        authorId: accessToken,
    });

    const handleChange = (field: keyof BookingRequest, value: string | number | Date | null) => {
        setBooking((prev) => ({
            ...prev,
            [field]: value,
        }));

        if (booking.bookingStart && (field == 'bookingEnd' && value)) {
            const date = value as Date;

            dispatch(fetchHardware({
                "booking_start": booking.bookingStart.toISOString(),
                "booking_end": date.toISOString()
            }))
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('Submitted booking:', booking);
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={de}>
            <Box component="form" onSubmit={handleSubmit} sx={{maxWidth: 400, mx: 'auto', p: 2}}>
                <Stack spacing={2}>
                    <DatePicker
                        label="Booking Start"
                        value={booking.bookingStart}
                        onChange={(date: Date | null) => handleChange('bookingStart', date || new Date())}
                        slotProps={{textField: {fullWidth: true, required: true}}}
                        minDate={new Date()}
                    />
                    <DatePicker
                        label="Booking End"
                        value={booking.bookingEnd}
                        disabled={booking.bookingStart === null}
                        onChange={(date: Date | null) => handleChange('bookingEnd', date || new Date())}
                        slotProps={{textField: {fullWidth: true, required: true}}}
                        minDate={booking.bookingStart ?? new Date()}
                    />
                    <HardwareSelect disabled={booking.bookingStart === null || booking.bookingEnd === null}/>
                    <Button variant="contained" color="primary" type="submit">
                        Submit
                    </Button>
                </Stack>
            </Box>
        </LocalizationProvider>
    );
};
