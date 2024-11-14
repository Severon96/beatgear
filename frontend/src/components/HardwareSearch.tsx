import React, {useState} from 'react';
import {
    Box,
    Checkbox,
    FormControl,
    InputLabel,
    List,
    ListItem,
    ListItemText,
    MenuItem,
    OutlinedInput,
    Select,
    TextField
} from '@mui/material';
import {Hardware, HardwareCategory} from "../models/Hardware";
import Typography from "@mui/material/Typography";

interface HardwareSearchProps {
    hardwareList: Hardware[];
    errorMessage: string | null;
}

const HardwareSearch: React.FC<HardwareSearchProps> = ({hardwareList, errorMessage}) => {
    const [searchName, setSearchName] = useState<string>('');
    const [selectedCategories, setSelectedCategories] = useState<HardwareCategory[]>([]);

    const filteredHardware = hardwareList.filter((hardware) => {
        const matchesName = hardware.name.toLowerCase().includes(searchName.toLowerCase());
        const matchesCategory = selectedCategories ? selectedCategories.includes(hardware.category) : true;
        return matchesName && matchesCategory;
    });

    return (
        <Box>
            <Box display={"flex"} flexDirection={"row"} gap={2}>
                {/* Filter für den Hardware Namen */}
                <TextField
                    label="Name"
                    variant="outlined"
                    fullWidth
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                />
                {/* Filter by hardware category */}
                <FormControl fullWidth>
                    <InputLabel id="demo-multiple-checkbox-label">Kategorie</InputLabel>
                    <Select
                        labelId="demo-multiple-checkbox-label"
                        multiple
                        variant={"filled"}
                        label="Kategorie"
                        value={selectedCategories}
                        onChange={
                            (e) => {
                                setSelectedCategories(e.target.value as HardwareCategory[])
                            }}
                        input={<OutlinedInput label="Tag"/>}
                        renderValue={(selected) => selected.length == 0 ? "Alle" : selected.join(', ')}
                    >
                        {Object.values(HardwareCategory).map((category) => (
                            <MenuItem key={category} value={category}>
                                <Checkbox checked={selectedCategories.includes(category)}/>
                                <ListItemText primary={category}/>
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>

            {
                errorMessage ? (
                    <Typography marginTop={2} color={"error"}>{errorMessage}</Typography>
                ) : (
                    <List>
                        {filteredHardware.length > 0 ? (
                            filteredHardware.map((hardware) => (
                                <ListItem key={hardware.id}>
                                    <ListItemText
                                        primary={hardware.name}
                                        secondary={`Category: ${hardware.category} | Price per Hour: $${hardware.price_per_hour}`}
                                    />
                                </ListItem>
                            ))
                        ) : (
                            <ListItem>
                                <ListItemText primary="No hardware found"/>
                            </ListItem>
                        )}
                    </List>
                )
            }
        </Box>
    );
};

export default HardwareSearch;
