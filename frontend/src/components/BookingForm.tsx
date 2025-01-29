import React, {useState} from 'react';
import {Box, Button, Stack, TextField} from '@mui/material';
import {BookingRequest} from "../models/Booking";
import {DateTimePicker, LocalizationProvider, renderTimeViewClock} from "@mui/x-date-pickers";
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFnsV3";
import {useSelector} from "react-redux";
import {RootState, useAppDispatch} from "../store";
import {de} from "date-fns/locale";
import HardwareSelect from "./HardwareSelect";
import {fetchHardware} from "../redux-tk/slices/hardwareSlice";
import {v4 as uuid} from "uuid";
import {jwtDecode} from "jwt-decode";

interface BookingFormProps {
    initialValues?: BookingRequest;
    onFormSubmit: (booking: BookingRequest) => void;
}

export const BookingForm: React.FC<BookingFormProps> = ({onFormSubmit, initialValues = undefined}) => {
    const dispatch = useAppDispatch();
    const {accessToken} = useSelector((state: RootState) => state.auth);
    const decodedToken: { sub: string } = jwtDecode(accessToken ?? "");

    const initialState: BookingRequest = {
        id: uuid(),
        name: '',
        customerId: decodedToken.sub,
        hardwareIds: [],
        bookingStart: null,
        bookingEnd: null,
        totalAmount: 0,
        totalBookingDays: 1,
        authorId: decodedToken.sub,
    };
    const [booking, setBooking] = useState<BookingRequest>(initialValues ? initialValues : initialState);

    const handleChange = (field: keyof BookingRequest, value: string | string[] | number | Date | null) => {
        setBooking((prev) => ({
            ...prev,
            [field]: value,
        }));

        if (booking.bookingStart && (field == 'bookingEnd' && value)) {
            const date = value as Date;

            dispatch(fetchHardware({
                "bookingStart": booking.bookingStart.toISOString(),
                "bookingEnd": date.toISOString()
            }))
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onFormSubmit(booking)
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={de}>
            <Box component="form" onSubmit={handleSubmit} sx={{maxWidth: 400, mx: 'auto', p: 2}}>
                <Stack spacing={2}>
                    <TextField
                        id="booking-name"
                        label="Name"
                        variant="outlined"
                        value={booking.name}
                        required={true}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            handleChange('name', event.target.value || "")
                        }}
                    />
                    <DateTimePicker
                        viewRenderers={{
                            hours: renderTimeViewClock,
                            minutes: renderTimeViewClock,
                            seconds: renderTimeViewClock,
                        }}
                        label="Booking Start"
                        value={booking.bookingStart}
                        onChange={(date: Date | null) => handleChange('bookingStart', date || new Date())}
                        slotProps={{textField: {fullWidth: true, required: true}}}
                        minDate={new Date()}
                    />
                    <DateTimePicker
                        viewRenderers={{
                            hours: renderTimeViewClock,
                            minutes: renderTimeViewClock,
                            seconds: renderTimeViewClock,
                        }}
                        label="Booking End"
                        value={booking.bookingEnd}
                        disabled={booking.bookingStart === null}
                        onChange={(date: Date | null) => handleChange('bookingEnd', date || new Date())}
                        slotProps={{textField: {fullWidth: true, required: true}}}
                        minDate={booking.bookingStart ?? new Date()}
                    />
                    <HardwareSelect
                        disabled={booking.bookingStart === null || booking.bookingEnd === null}
                        handleChange={(selectedHardware) => {
                            handleChange('hardwareIds', selectedHardware.target.value);
                        }}
                    />
                    <Button variant="contained" color="primary" type="submit">
                        Jetzt buchen
                    </Button>
                </Stack>
            </Box>
        </LocalizationProvider>
    );
};
