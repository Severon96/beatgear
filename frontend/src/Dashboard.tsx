import {Header} from "./components/header";
import React from "react";

export function Dashboard() {
    return (
        <div
            className="items-center justify-items-center min-h-screen pb-20 gap-16 font-[family-name:var(--font-geist-sans)] overflow-x-hidden relative"
            suppressHydrationWarning={true}>
            <main className="flex flex-col gap-8 items-center sm:items-start w-full relative">
                <header className="w-full relative">
                    <Header/>
                </header>
            </main>
        </div>
    );
}