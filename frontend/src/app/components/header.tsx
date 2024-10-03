import React from "react";
import Image from "next/image";
import {metadata} from "@/app/layout";

export function Header() {
    return (
        <div className="w-full flex flex-col md:flex-row justify-between items-center pt-16 pb-2 md:pt-4 md:mt-0 border-b-2">
            <div className="flex items-center space-x-2">
                <Image
                    src="/images/logo.jpeg"
                    width={50}
                    height={50}
                    alt="BeatGear Logo"
                />
                <span>{`${metadata.title}`}</span>
            </div>
            <div className="flex items-center space-x-2 mt-4 md:mt-0">
                <a href="login" className="button-secondary-blue py-1 px-3 rounded-lg">
                    Anmelden
                </a>
                <a href="register" className="button-secondary-grey py-1 px-3 rounded-lg">
                    Registrieren
                </a>
            </div>
        </div>
    );
}