import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import axiosInstance from "../../utils/apiConfig";
import {Hardware, HardwareStatus} from "../../models/Hardware";

interface FetchHardwareParams {
    bookingStart?: string | null;
    bookingEnd?: string | null;
}

interface FetchHardwareResponse {
    data: Hardware[];
}

export interface HardwareState {
    fetchHardwareStatus?: HardwareStatus;
    hardware: Hardware[];
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
    name: 'hardware',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchHardware.fulfilled, (state, action) => {
            state.hardware = action.payload.data;
            state.fetchHardwareStatus = "succeeded"
        })
        builder.addCase(fetchHardware.pending, (state) => {
            state.fetchHardwareStatus = "loading"
        })
        builder.addCase(fetchHardware.rejected, (state) => {
            state.fetchHardwareStatus = "failed"
        })
    }
})

export default hardwareSlice.reducer