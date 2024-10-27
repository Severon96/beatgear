import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import axiosInstance from "../../utils/apiConfig";
import {Hardware} from "../../models/Hardware";

interface FetchHardwareParams {
    bookingStart?: string | null;
    bookingEnd?: string | null;
}

interface FetchHardwareResponse {
    data: Hardware[];
}

interface HardwareState {
    hardware: Hardware[]
}

const initialState = {hardware: []} satisfies HardwareState as HardwareState

export const fetchHardware = createAsyncThunk<FetchHardwareResponse, FetchHardwareParams>(
    'hardware/fetchHardware',
    async ({bookingStart = null, bookingEnd = null}) => {
        const params: Record<string, string> = {};

        if (bookingStart) {
            params.bookingStart = bookingStart;
        }
        if (bookingEnd) {
            params.bookingEnd = bookingEnd;
        }
        const response = await axiosInstance.get(
            `hardware`,
            {params}
        )

        return {data: response.data};
    }
)

const hardwareSlice = createSlice({
    name: 'bookings',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchHardware.fulfilled, (state, action) => {
            state.hardware = action.payload.data;
        })
    }
})

export default hardwareSlice.reducer