import React from "react";
import Image from "next/image";
import {metadata} from "@/app/layout";

export function Header() {
    return (
        <div className={`w-screen flex-col grid-cols-3`}>
            <div className={"flex-col grid-cols-2"}>
                <Image
                    src="/images/logo.png"
                    width={50}
                    height={50}
                    alt="BeatzGear Logo"
                />
                <div>
                    {`${metadata.title}`}
                </div>
            </div>

        </div>
    );
}