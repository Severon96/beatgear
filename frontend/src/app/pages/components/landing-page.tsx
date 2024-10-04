import React from 'react';
import Image from "next/image";

export function LandingPage() {
    return (
        <div>
            <Image
                src="/images/hero_image.jpeg"
                width={100}
                height={100}
                alt="BeatGear Hero Image"
            />
        </div>
    )
}