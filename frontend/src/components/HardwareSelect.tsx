import React from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import {useAppSelector} from "../store";

const HardwareSelect: React.FC = () => {
    const hardware = useAppSelector((state) => state.hardware.hardware);

    return (
        <Autocomplete
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
