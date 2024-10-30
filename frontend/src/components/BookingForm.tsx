import React, {useState} from 'react';
import {Box, Button, Stack} from '@mui/material';
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
        customer_id: decodedToken.sub,
        hardware_ids: [],
        booking_start: null,
        booking_end: null,
        author_id: decodedToken.sub,
    };
    const [booking, setBooking] = useState<BookingRequest>(initialValues ? initialValues : initialState);

    const handleChange = (field: keyof BookingRequest, value: string | string[] | number | Date | null) => {
        setBooking((prev) => ({
            ...prev,
            [field]: value,
        }));

        if (booking.booking_start && (field == 'booking_end' && value)) {
            const date = value as Date;

            dispatch(fetchHardware({
                "booking_start": booking.booking_start.toISOString(),
                "booking_end": date.toISOString()
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
                    <DateTimePicker
                        viewRenderers={{
                            hours: renderTimeViewClock,
                            minutes: renderTimeViewClock,
                            seconds: renderTimeViewClock,
                        }}
                        label="Booking Start"
                        value={booking.booking_start}
                        onChange={(date: Date | null) => handleChange('booking_start', date || new Date())}
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
                        value={booking.booking_end}
                        disabled={booking.booking_start === null}
                        onChange={(date: Date | null) => handleChange('booking_end', date || new Date())}
                        slotProps={{textField: {fullWidth: true, required: true}}}
                        minDate={booking.booking_start ?? new Date()}
                    />
                    <HardwareSelect
                        disabled={booking.booking_start === null || booking.booking_end === null}
                        handleChange={(selectedHardware) => {
                            handleChange('hardware_ids', selectedHardware.target.value);
                        }}
                    />
                    <Button variant="contained" color="primary" type="submit">
                        Submit
                    </Button>
                </Stack>
            </Box>
        </LocalizationProvider>
    );
};
