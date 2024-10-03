import React from "react";
import Image from "next/image";
import {metadata} from "@/app/layout";

export function Header() {
    return (
        <div className="w-full grid grid-cols-2 relative">
            <div className="flex items-center space-x-2 relative">
                <Image
                    src="/images/logo.jpeg"
                    width={50}
                    height={50}
                    alt="BeatGear Logo"
                />
                <span>{`${metadata.title}`}</span>
            </div>
            <div className="flex items-center ml-auto space-x-2 relative">
                <a href={"login"} className={"button-secondary-blue py-1 px-3 rounded-lg"}>
                    Login
                </a>
                <a href={"register"} className={"button-secondary-grey py-1 px-3 rounded-lg"}>
                    Register
                </a>
            </div>
        </div>
    );
}