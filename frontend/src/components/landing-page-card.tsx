import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

interface LandingPageCardProps {
    imageSrc: string;
    imageAlt: string;
    title: string;
    description: string;
}

export function LandingPageCard({imageSrc, imageAlt, title, description}: LandingPageCardProps) {
    return (
        <Box>
            <Box
                component="img"
                src={imageSrc}
                alt={imageAlt}
                sx={{
                    width: "100%",
                    borderRadius: "15%"
                }}
            />
            <Box>
                <Typography variant={"h6"}>{title}</Typography>
                <Typography variant={"subtitle1"}>{description}</Typography>
            </Box>
        </Box>
    );
}
