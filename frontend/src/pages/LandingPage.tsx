import React from "react";

export function LandingPage() {
    return (
        <div
            className="flex justify-center py-5 gap-16 font-[family-name:var(--font-geist-sans)] overflow-x-hidden">
            <div className={"flex relative w-3/4"}>
                <img
                    src="/images/hardware/controller.jpg"
                    className={"rounded-3xl"}
                    alt="DJ Controller by Dominik Kempf on Unsplash"
                />
                <div className={"flex flex-col gap-3 absolute text-white bottom-0 py-4 px-2"}>
                    <span className={"w-full text-2xl  font-extrabold"}>Dein Equipment, zu Geld gemacht</span>
                    <span className={"w-full text-base"}>Mit BeatGear, kannst du deine Controller, Lichter und mehr vermieten um nebenher etwas Geld zu verdienen. Es ist kostenlos und leicht zu starten.</span>
                </div>
            </div>
        </div>
    );
}