import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import axiosInstance from "../../utils/apiConfig";
import {Hardware} from "../../models/Hardware";

interface FetchHardwareParams {
    booking_start?: string | null;
    booking_end?: string | null;
}

interface FetchHardwareResponse {
    data: Hardware[];
}

export interface HardwareState {
    hardware: Hardware[]
}

const initialState = {hardware: []} satisfies HardwareState as HardwareState

export const fetchHardware = createAsyncThunk<FetchHardwareResponse, FetchHardwareParams>(
    'hardware/fetchHardware',
    async ({booking_start = null, booking_end = null}) => {
        const params: Record<string, string> = {};

        if (booking_start) {
            params.bookingStart = booking_start;
        }
        if (booking_end) {
            params.bookingEnd = booking_end;
        }
        const response = await axiosInstance.get(
            `hardware`,
            {params}
        )

        return {data: response.data};
    }
)

const hardwareSlice = createSlice({
    name: 'hardware',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchHardware.fulfilled, (state, action) => {
            state.hardware = action.payload.data;
        })
    }
})

export default hardwareSlice.reducer