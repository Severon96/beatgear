import React, {useContext, useState} from 'react';
import {
    Alert,
    Box, Card,
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
import Divider from "@mui/material/Divider";

interface HardwareSearchProps {
    hardwareList: Hardware[];
    bookingStart: Date | null;
    bookingEnd: Date | null;
    errorMessage: string | null;
}

const HardwareSearch: React.FC<HardwareSearchProps> = ({hardwareList, bookingStart, bookingEnd, errorMessage}) => {
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
                        renderValue={(selected) => {
                            const selectedReadable = selected.map((selectedCategory) => getReadableCategory(selectedCategory));
                            return selected.length == 0 ? "Alle" : selectedReadable.join(', ');
                        }}
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
            <Divider sx={{marginY: 2}}/>
            {
                errorMessage ? (
                    <Alert severity={"error"}>{errorMessage}</Alert>
                ) : (
                    <List>
                        {filteredHardware.length > 0 ? (
                            filteredHardware.map((hardware) => (
                                    <ListItem key={hardware.id} sx={{padding: 0, margin: 0}}>
                                        <Card sx={{width: '100%'}}>
                                            <Box display={"flex"} flexDirection={"row"}>
                                                <ListItemText
                                                    primary={hardware.name}
                                                    secondary={`Kategorie: ${getReadableCategory(hardware.category)} | Preis pro Stunde: ${hardware.price_per_day}€`}
                                                />
                                                {
                                                    cartContext.isItemInCart(hardware) ? (
                                                        <IconButton
                                                            color="inherit"
                                                            aria-label="remove from cart"
                                                            edge="start"
                                                            onClick={() => cartContext.removeCartItem(hardware)}
                                                            sx={{width: 60, borderRadius: "20%"}}
                                                        >
                                                            <RemoveShoppingCartIcon/>
                                                        </IconButton>
                                                    ) : (
                                                        <IconButton
                                                            color="inherit"
                                                            aria-label="add to cart"
                                                            onClick={() => {
                                                                cartContext.addCartItem(hardware);
                                                                cartContext.setBookingStartInCart(bookingStart);
                                                                cartContext.setBookingEndInCart(bookingEnd);
                                                            }}
                                                            sx={{width: 60, borderRadius: "20%"}}
                                                        >
                                                            <AddShoppingCartIcon/>
                                                        </IconButton>
                                                    )
                                                }
                                            </Box>
                                        </Card>
                                    </ListItem>
                                )
                            )
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
