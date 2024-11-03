import {ActionReducerMapBuilder, createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import {Booking, BookingRequest, BookingsStatus} from "../../models/Booking";
import axiosInstance from "../../utils/apiConfig";

interface ActiveBookingsState {
    activeBookings: Booking[]
    createdBooking?: Booking
    fetchBookingsStatus?: BookingsStatus
    createBookingStatus?: BookingsStatus
}

const initialState = {
    activeBookings: [],
    createdBooking: undefined,
    fetchBookingsStatus: undefined,
    createBookingStatus: undefined
} satisfies ActiveBookingsState as ActiveBookingsState

export const fetchBookings = createAsyncThunk(
    'bookings/fetchCurrent',
    async () => {
        const response = await axiosInstance.get(
            `bookings/current`
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
        setupActiveBookingsCases(builder);
        setupCreateBookingCases(builder);
    }
})

function setupActiveBookingsCases(builder: ActionReducerMapBuilder<ActiveBookingsState>) {
    builder.addCase(fetchBookings.fulfilled, (state, action) => {
        state.activeBookings = action.payload.data;
        state.fetchBookingsStatus = "succeeded";
    })
    builder.addCase(fetchBookings.pending, (state) => {
        state.fetchBookingsStatus = "loading";
    })
    builder.addCase(fetchBookings.rejected, (state) => {
        state.fetchBookingsStatus = "failed";
    })
}

function setupCreateBookingCases(builder: ActionReducerMapBuilder<ActiveBookingsState>) {
    builder.addCase(createBooking.fulfilled, (state, action) => {
        state.createdBooking = action.payload.data;
        state.createBookingStatus = "succeeded";
    })
    builder.addCase(createBooking.pending, (state) => {
        state.createBookingStatus = "loading";
    })
    builder.addCase(createBooking.rejected, (state) => {
        console.log("failed booking creation");
        state.createBookingStatus = "failed";
    })
}

export default bookingsSlice.reducer