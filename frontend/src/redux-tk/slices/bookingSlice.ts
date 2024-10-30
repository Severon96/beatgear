import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import {Booking, BookingRequest} from "../../models/Booking";
import axiosInstance from "../../utils/apiConfig";

interface ActiveBookingsState {
    activeBookings: Booking[]
}

const initialState = {activeBookings: []} satisfies ActiveBookingsState as ActiveBookingsState

export const fetchActiveBookings = createAsyncThunk(
    'bookings/fetchActive',
    async () => {
        const response = await axiosInstance.get(
            `bookings/active`
        )

        return {data: response.data};
    }
)

export const createBooking = createAsyncThunk(
    'bookings/create',
    async (bookingRequest: BookingRequest) => {
        const response = await axiosInstance.post(
            `bookings`, bookingRequest
        )

        return {data: response.data};
    }
)

const bookingsSlice = createSlice({
    name: 'bookings',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchActiveBookings.fulfilled, (state, action) => {
            state.activeBookings = action.payload.data;
        })
        builder.addCase(createBooking.fulfilled, (state, action) => {
            state.activeBookings = action.payload.data;
        })
    }
})

export default bookingsSlice.reducer