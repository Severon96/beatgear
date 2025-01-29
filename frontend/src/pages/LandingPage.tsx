import React from "react";
import {LandingPageCard} from "../components/LandingPageCard";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {Button, Grid2, Stack} from "@mui/material";

interface ILandingPageCard {
    imageSrc: string;
    imageAlt: string;
    title: string;
    description: string;
}

const landingPageCards: ILandingPageCard[] = [
    {
        imageSrc: "/images/hardware/controller_2_dominik_kempf.jpg",
        imageAlt: "DJ Controller by Dominik Kempf on Unsplash",
        title: "Controller",
        description: "Vermiete deine DJ Controller und anderes Audio Equipment an DJs."
    },
    {
        imageSrc: "/images/hardware/lights_1_antoine_j.jpg",
        imageAlt: "Club by Antoine J. on Unsplash",
        title: "Beleuchtung",
        description: "Teile deine Beleuchtung mit Event-Organisatoren."
    },
    {
        imageSrc: "/images/hardware/cables_1_mika_baumeister.jpg",
        imageAlt: "XLR Cables by Mika Baumeister on Unsplash",
        title: "Kabel",
        description: "Monetarisiere deine Kabelsammlung indem du sie anderen zur Verfügung stellst."
    },
    {
        imageSrc: "/images/hardware/laptop_stand_1_riekus.jpg",
        imageAlt: "Laptop Stand by Riekus on Unsplash",
        title: "Peripherie",
        description: "Verdiene Geld indem du deine Peripherie mieten lässt."
    }
]

export function LandingPage() {
    const rootUrl = process.env.REACT_APP_ROOT_URL;
    const oauthUrl = process.env.REACT_APP_OAUTH_ISSUER;
    const realmName = process.env.REACT_APP_OAUTH_REALM;
    const clientId = process.env.REACT_APP_OAUTH_CLIENT_ID;
    const redirectPath = process.env.REACT_APP_OAUTH_REDIRECT_PATH;

    return (
        <Box sx={{mb: 5}}>
            <Box sx={{
                position: "relative"
            }}>
                <Box
                    component="img"
                    src="/images/hardware/controller_1_dominik_kempf.jpg"
                    sx={{
                        maxWidth: "100%",
                        borderRadius: "35px"
                    }}
                    alt="DJ Controller by Dominik Kempf on Unsplash"
                />
                <Stack sx={{
                    position: "absolute",
                    bottom: 0,
                    p: 2,
                }}>
                    <Typography
                        variant="h5"
                        sx={{
                            color: "common.white",
                        }}
                    >
                        Dein Equipment, zu Geld gemacht
                    </Typography>
                    <Typography
                        variant="subtitle1"
                        sx={{
                            color: "common.white"
                        }}
                    >
                        Mit BeatGear, kannst du deine Controller, Lichter und mehr vermieten um nebenher etwas Geld zu
                        verdienen. Es ist kostenlos und leicht zu starten.
                    </Typography>
                </Stack>
            </Box>
            <Box sx={{mb: 5}}>
                <Typography
                    variant="h1"
                    sx={{
                        mt: 6,
                        mb: 4,
                    }}
                >Was kannst du anbieten?</Typography>
                <Grid2 container spacing={2}>
                    {
                        landingPageCards.map(({imageSrc, imageAlt, title, description}, index) =>
                            (
                                <Grid2 size={{xs: 12, sm: 6, md: 3}} key={index}>
                                    <LandingPageCard
                                        imageSrc={imageSrc}
                                        imageAlt={imageAlt}
                                        title={title}
                                        description={description}
                                    />
                                </Grid2>
                            )
                        )
                    }
                </Grid2>
            </Box>
            <Grid2 container direction={"column"} alignItems={"center"} spacing={2}>
                <Typography variant={"h1"}>Bereit loszulegen?</Typography>
                <Button variant="contained"
                        href={`${oauthUrl}/realms/${realmName}/protocol/openid-connect/auth?client_id=${clientId}&redirect_uri=${rootUrl}${redirectPath}&response_type=code&scope=openid`}>
                    Anmelden
                </Button>
            </Grid2>
        </Box>
    );
}