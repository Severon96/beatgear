import React, {useState} from 'react';
import {Box, Button, Stack} from '@mui/material';
import {BookingRequest} from "../models/Booking";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import {LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFnsV3";
import {useSelector} from "react-redux";
import {RootState} from "../store";
import {de} from "date-fns/locale";

export const BookingForm: React.FC = () => {
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

    const handleChange = (field: keyof BookingRequest, value: any) => {
        setBooking((prev) => ({
            ...prev,
            [field]: value,
        }));
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
                    <Button variant="contained" color="primary" type="submit">
                        Submit
                    </Button>
                </Stack>
            </Box>
        </LocalizationProvider>
    );
};
