import React from "react";
import Image from "next/image";
import {metadata} from "@/app/layout";

export function Header() {
    return (
        <div className={`w-screen grid flex-col grid-cols-4`}>
            <div className={"grid flex-col grid-cols-2"}>
                <Image
                    src="/images/logo.jpeg"
                    width={50}
                    height={50}
                    alt="BeatGear Logo"
                />
                <div className={"flex h-full font-[family-name:var(--font-outfit)]"}>
                    <span className={"content-center"}>{`${metadata.title}`}</span>
                </div>
            </div>

        </div>
    );
}