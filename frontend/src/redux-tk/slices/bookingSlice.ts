import {ActionReducerMapBuilder, createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import {Booking, BookingRequest, BookingsStatus} from "../../models/Booking";
import axiosInstance from "../../utils/apiConfig";

interface BookingsState {
    activeBookings: Booking[]
    createdBooking?: Booking
    createdBookingInquiry?: BookingRequest
    inquiries: Booking[]
    fetchBookingsStatus?: BookingsStatus
    createBookingStatus?: BookingsStatus
    inquireBookingStatus?: BookingsStatus
    inquiriesStatus?: BookingsStatus
}

const initialState = {
    activeBookings: [],
    createdBooking: undefined,
    createdBookingInquiry: undefined,
    inquiries: [],
    fetchBookingsStatus: undefined,
    createBookingStatus: undefined,
    inquireBookingStatus: undefined,
    inquiriesStatus: undefined
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

export const inquireBooking = createAsyncThunk(
    'bookings/inquire',
    async (bookingRequest: BookingRequest) => {
        const response = await axiosInstance.post(
            `bookings/inquire`, bookingRequest
        )

        return {data: response.data};
    }
)

export const fetchInquiries = createAsyncThunk(
    'bookings/inquiries',
    async () => {
        const response = await axiosInstance.get(
            `bookings/inquiries`
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
        setupInquireBookingCases(builder);
        setupFetchInquiriesCases(builder)
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

function setupFetchInquiriesCases(builder: ActionReducerMapBuilder<BookingsState>) {
    builder.addCase(fetchInquiries.fulfilled, (state, action) => {
        state.inquiries = action.payload.data;
        state.inquiriesStatus = "succeeded";
    })
    builder.addCase(fetchInquiries.pending, (state) => {
        state.inquiriesStatus = "loading";
    })
    builder.addCase(fetchInquiries.rejected, (state) => {
        console.log("failed fetching inquiries");
        state.inquiriesStatus = "failed";
    })
}

export default bookingsSlice.reducer