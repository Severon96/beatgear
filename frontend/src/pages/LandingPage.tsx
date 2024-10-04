import React from "react";

export function LandingPage() {
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
                    <span className={"w-full text-2xl  font-extrabold"}>Dein Equipment, zu Geld gemacht</span>
                    <span className={"w-full text-base"}>Mit BeatGear, kannst du deine Controller, Lichter und mehr vermieten um nebenher etwas Geld zu verdienen. Es ist kostenlos und leicht zu starten.</span>
                </div>
            </div>
            <div className="w-4/5">
                <h1 className={"text-4xl font-extrabold"}>Was kannst du anbieten?</h1>
            </div>
        </div>
    );
}