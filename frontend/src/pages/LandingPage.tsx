import React from "react";
import {LandingPageCard} from "../components/landing-page-card";

export function LandingPage() {
    const rootUrl = process.env.REACT_APP_ROOT_URL;
    const oauthUrl = process.env.REACT_APP_OAUTH_ISSUER;
    const realmName = process.env.REACT_APP_OAUTH_REALM;
    const clientId = process.env.REACT_APP_OAUTH_CLIENT_ID;
    const redirectPath = process.env.REACT_APP_OAUTH_REDIRECT_PATH;

    return (
        <div
            className="flex flex-col items-center justify-center py-5 gap-6 font-[family-name:var(--font-geist-sans)] overflow-x-hidden">
            <div className={"relative w-4/5"}>
                <img
                    src="/images/hardware/controller_1_dominik_kempf.jpg"
                    className={"rounded-3xl"}
                    alt="DJ Controller by Dominik Kempf on Unsplash"
                />
                <div className={"flex flex-col gap-3 absolute text-white bottom-0 py-4 px-2"}>
                    <span className={"w-full text-2xl font-extrabold"}>Dein Equipment, zu Geld gemacht</span>
                    <span className={"w-full text-base"}>Mit BeatGear, kannst du deine Controller, Lichter und mehr vermieten um nebenher etwas Geld zu verdienen. Es ist kostenlos und leicht zu starten.</span>
                </div>
            </div>
            <div className="flex flex-col gap-3 w-4/5">
                <h1 className="text-2xl md:text-4xl font-extrabold">Was kannst du anbieten?</h1>
                <div className="flex flex-row gap-3 overflow-x-auto">
                    <LandingPageCard
                        imageSrc={"/images/hardware/controller_2_dominik_kempf.jpg"}
                        imageAlt={"DJ Controller by Dominik Kempf on Unsplash"}
                        title={"Controller"}
                        description={"Vermiete deine DJ Controller und anderes Audio Equipment an DJs."}
                    />
                    <LandingPageCard
                        imageSrc={"/images/hardware/lights_1_antoine_j.jpg"}
                        imageAlt={"Club by Antoine J. on Unsplash"}
                        title={"Beleuchtung"}
                        description={"Teile deine Beleuchtung mit Event-Organisatoren."}
                    />
                    <LandingPageCard
                        imageSrc={"/images/hardware/cables_1_mika_baumeister.jpg"}
                        imageAlt={"XLR Cables by Mika Baumeister on Unsplash"}
                        title={"Kabel"}
                        description={"Monetarisiere deine Kabelsammlung indem du sie anderen zur Verfügung stellst."}
                    />
                    <LandingPageCard
                        imageSrc={"/images/hardware/laptop_stand_1_riekus.jpg"}
                        imageAlt={"Laptop Stand by Riekus on Unsplash"}
                        title={"Peripherie"}
                        description={"Verdiene Geld indem du deine Peripherie mieten lässt."}
                    />
                </div>
            </div>
            <div className={"flex flex-col items-center gap-6 w-4/5"}>
                <h1 className={"text-2xl md:text-4xl font-extrabold"}>Bereit loszulegen?</h1>
                <a
                    href={`${oauthUrl}/realms/${realmName}/protocol/openid-connect/auth?client_id=${clientId}&redirect_uri=${rootUrl}${redirectPath}&response_type=code&scope=openid`}
                    className="button-secondary-blue text-2xl font-normal py-4 px-5 rounded-lg"
                >
                    Anmelden
                </a>
            </div>
        </div>
    );
}