import {ActionReducerMapBuilder, createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import {Booking, BookingRequest, BookingsStatus} from "../../models/Booking";
import axiosInstance from "../../utils/apiConfig";

interface BookingsState {
    activeBookings: Booking[]
    createdBooking?: Booking
    createdBookingInquiry?: BookingRequest
    fetchBookingsStatus?: BookingsStatus
    createBookingStatus?: BookingsStatus
    inquireBookingStatus?: BookingsStatus
}

const initialState = {
    activeBookings: [],
    createdBooking: undefined,
    createdBookingInquiry: undefined,
    fetchBookingsStatus: undefined,
    createBookingStatus: undefined,
    inquireBookingStatus: undefined
} satisfies BookingsState as BookingsState

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

export const inquireBooking = createAsyncThunk(
    'bookings/inquire',
    async (bookingRequest: BookingRequest) => {
        const response = await axiosInstance.post(
            `bookings/inquire`, bookingRequest
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
        setupInquireBookingCases(builder);
    }
})

function setupActiveBookingsCases(builder: ActionReducerMapBuilder<BookingsState>) {
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

function setupCreateBookingCases(builder: ActionReducerMapBuilder<BookingsState>) {
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

function setupInquireBookingCases(builder: ActionReducerMapBuilder<BookingsState>) {
    builder.addCase(inquireBooking.fulfilled, (state, action) => {
        state.createdBookingInquiry = action.payload.data;
        state.inquireBookingStatus = "succeeded";
    })
    builder.addCase(inquireBooking.pending, (state) => {
        state.inquireBookingStatus = "loading";
    })
    builder.addCase(inquireBooking.rejected, (state) => {
        console.log("failed booking inquiry");
        state.inquireBookingStatus = "failed";
    })
}

export default bookingsSlice.reducer