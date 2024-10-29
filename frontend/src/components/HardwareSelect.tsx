import React from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import {useAppSelector} from "../store";

interface HardwareSelectProps {
    disabled?: boolean
}

const HardwareSelect: React.FC<HardwareSelectProps> = ({ disabled = false }) => {
    const hardware = useAppSelector((state) => state.hardware.hardware);

    return (
        <Autocomplete
            disabled={disabled}
            multiple
            options={hardware}
            getOptionLabel={(option) => option.name}
            renderInput={(params) => (
                <TextField {...params} variant="outlined" label="Select Options" placeholder="Choose..." />
            )}
            onChange={(event, newValue) => {
                console.log('Selected values:', newValue);
            }}
        />
    );
};

export default HardwareSelect;
