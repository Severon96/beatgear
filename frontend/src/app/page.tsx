import React from "react";
import {Header} from "@/app/pages/components/header";
import {isLoggedIn} from "@/app/utils/auth";
import {LandingPage} from "@/app/pages/components/landing-page";

export default async function Home() {
    return (
        <div
            className="items-center justify-items-center min-h-screen pb-20 gap-16 font-[family-name:var(--font-geist-sans)] overflow-x-hidden relative" suppressHydrationWarning={true}>
            <main className="flex flex-col gap-8 items-center sm:items-start w-full relative">
                <header className="w-full relative">
                    <Header/>
                </header>
                {
                    await isLoggedIn() ? "Logged in" : <LandingPage />
                }
            </main>
        </div>
    );
}
