import React from "react";

export function UserLandingPage() {
    return (
        <div
            className="items-center justify-items-center min-h-screen pb-20 gap-16 font-[family-name:var(--font-geist-sans)] overflow-x-hidden relative"
            suppressHydrationWarning={true}>
            <p>{`You're logged in, have fun!`}</p>
        </div>
    );
}