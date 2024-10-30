import {ActionReducerMapBuilder, createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import {Booking, BookingRequest} from "../../models/Booking";
import axiosInstance from "../../utils/apiConfig";

type BookingsStatus = "succeeded" | "loading" | "failed";

interface ActiveBookingsState {
    activeBookings: Booking[]
    createdBooking?: Booking
    fetchActiveBookingsStatus?: BookingsStatus
    createBookingStatus?: BookingsStatus
}

const initialState = {
    activeBookings: [],
    createdBooking: undefined,
    fetchActiveBookingsStatus: undefined,
    createBookingStatus: undefined
} satisfies ActiveBookingsState as ActiveBookingsState

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
        setupActiveBookingsCases(builder);
        setupCreateBookingCases(builder);
    }
})

function setupActiveBookingsCases(builder: ActionReducerMapBuilder<ActiveBookingsState>) {
    builder.addCase(fetchActiveBookings.fulfilled, (state, action) => {
        state.activeBookings = action.payload.data;
        state.fetchActiveBookingsStatus = "succeeded";
    })
    builder.addCase(fetchActiveBookings.pending, (state) => {
        state.fetchActiveBookingsStatus = "loading";
    })
    builder.addCase(fetchActiveBookings.rejected, (state) => {
        state.fetchActiveBookingsStatus = "failed";
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