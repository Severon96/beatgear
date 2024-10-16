import React from "react";
import Box from "@mui/material/Box";

interface LandingPageCardProps {
    imageSrc: string;
    imageAlt: string;
    title: string;
    description: string;
}

export function LandingPageCard({imageSrc, imageAlt, title, description}: LandingPageCardProps) {
    return (
        <div className="w-full flex flex-col flex-wrap items-center py-1 px-2 md:mt-0 relative">
            <Box
                component="img"
                src={imageSrc}
                alt={imageAlt}
                sx={{
                    width: 120,
                    height: 120
                }}
                className="w-full object-contain rounded-lg"
            />
            <div className="flex flex-col items-center w-4/5">
                <h2 className="text-2xl font-extrabold text-gray-700 mt-4 text-center">{title}</h2>
                <p className="text-sm text-gray-500 mt-2 text-center">{description}</p>
            </div>
        </div>
    );
}
