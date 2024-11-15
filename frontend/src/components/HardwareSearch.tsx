import React, {useContext, useState} from 'react';
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
import {getReadableCategory, Hardware, HardwareCategory} from "../models/Hardware";
import Typography from "@mui/material/Typography";
import {CartContext} from "./providers/CartProvider";
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart';
import IconButton from "@mui/material/IconButton";

interface HardwareSearchProps {
    hardwareList: Hardware[];
    errorMessage: string | null;
}

const HardwareSearch: React.FC<HardwareSearchProps> = ({hardwareList, errorMessage}) => {
    const cartContext = useContext(CartContext);
    const [searchName, setSearchName] = useState<string>('');
    const [selectedCategories, setSelectedCategories] = useState<HardwareCategory[]>([]);

    const filteredHardware = hardwareList.filter((hardware) => {
        const matchesName = searchName.length > 0 ? hardware.name.toLowerCase().includes(searchName.toLowerCase()) : true;
        const matchesCategory = selectedCategories.length > 0 ? selectedCategories.includes(hardware.category) : true;
        return matchesName && matchesCategory;
    });

    return (
        <Box>
            <Box display={"flex"} flexDirection={"row"} gap={2}>
                <TextField
                    label="Name"
                    variant="outlined"
                    fullWidth
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                />
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
                                <ListItemText primary={getReadableCategory(category)}/>
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
                            filteredHardware.map((hardware) => {
                                console.log(`Hardware Category: ${hardware.category}`)
                                return (
                                <ListItem key={hardware.id} sx={{width: '100%'}}>
                                    <ListItemText
                                        primary={hardware.name}
                                        secondary={`Kategorie: ${getReadableCategory(hardware.category)} | Preis pro Stunde: ${hardware.price_per_day}€`}
                                    />
                                    {
                                        cartContext.isItemInCart(hardware) ? (
                                            <IconButton
                                                color="inherit"
                                                aria-label="open drawer"
                                                edge="start"
                                                onClick={() => cartContext.removeCartItem(hardware)}
                                            >
                                                <RemoveShoppingCartIcon/>
                                            </IconButton>
                                        ) : (
                                            <IconButton
                                                color="inherit"
                                                aria-label="open drawer"
                                                edge="start"
                                                onClick={() => cartContext.addCartItem(hardware)}
                                            >
                                                <AddShoppingCartIcon />
                                            </IconButton>
                                        )
                                    }
                                </ListItem>
                            )})
                        ) : (
                            <ListItem>
                                <ListItemText primary="Keine Hardware gefunden."/>
                            </ListItem>
                        )}
                    </List>
                )
            }
        </Box>
    );
};

export default HardwareSearch;
