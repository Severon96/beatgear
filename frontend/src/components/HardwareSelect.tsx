import React, {useState} from 'react';
import {useAppSelector} from "../store";
import {Box, Chip, FormControl, InputLabel, MenuItem, OutlinedInput, Select, SelectChangeEvent} from "@mui/material";

interface HardwareSelectProps {
    disabled?: boolean,
    handleChange: (event: SelectChangeEvent<string[]>) => void,
}

const HardwareSelect: React.FC<HardwareSelectProps> = ({ disabled = false, handleChange }) => {
    const hardware = useAppSelector((state) => state.hardware.hardware);
    const [selectedHardwareIds, setSelectedHardwareIds] = useState<string[]>([]);

    const handleSelectChange = (event: SelectChangeEvent<string[]>) => {
        const selectedIds = event.target.value as string[];
        setSelectedHardwareIds(selectedIds);
        handleChange(event);
    };

    return (
        <FormControl sx={{ m: 1, width: 300 }} disabled={disabled}>
            <InputLabel id="hardware-select-label">Hardware</InputLabel>
            <Select
                labelId="hardware-select-label"
                id="hardware-select-chip"
                multiple
                value={selectedHardwareIds}
                variant={"outlined"}
                onChange={handleSelectChange}
                input={<OutlinedInput id="hardware-select-multiple-chip" label="Hardware" />}
                renderValue={(selected) => {
                    console.log("selected values: ", selected);
                    return (
                        <Box sx={{display: 'flex', flexWrap: 'wrap', gap: 0.5}}>
                            {selected.map((userSelectedHardwareId) => {
                                const selectedHardware = hardware.find((h) => h.id === userSelectedHardwareId);
                                return selectedHardware ? (
                                    <Chip key={selectedHardware.id} label={selectedHardware.name}/>
                                ) : null;
                            })}
                        </Box>
                    )
                }}
            >
                {hardware.map((hardware) => (
                    <MenuItem
                        key={hardware.id}
                        value={hardware.id}
                    >
                        {hardware.name}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

export default HardwareSelect;
