import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import {Booking} from "../../models/Booking";
import axiosInstance from "../../utils/apiConfig";

interface ActiveBookingsState {
    activeBookings: Booking[]
}

const initialState = { activeBookings: [] } satisfies ActiveBookingsState as ActiveBookingsState

const fetchActiveBookings = createAsyncThunk(
    'bookings/fetchActive',
    async (accessToken: string) => {
        const response = await axiosInstance.get(
            `bookings/active`,
            {
                headers: {
                    "Authorization": `Bearer ${accessToken}`
                }
            }
        )

        return response.data;
    }
)

const bookingsSlice = createSlice({
    name: 'bookings',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchActiveBookings.fulfilled, (state, action) => {
            state.activeBookings = action.payload;
        })
    }
})

export default bookingsSlice.reducer