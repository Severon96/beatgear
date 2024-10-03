import type {Metadata} from "next";
import localFont from "next/font/local";
import "./globals.css";
import React from "react";
import {Outfit} from "next/font/google";
import {NextFontWithVariable} from "next/dist/compiled/@next/font";

const geistSans = localFont({
    src: "./fonts/GeistVF.woff",
    variable: "--font-geist-sans",
    weight: "100 900",
});
const geistMono = localFont({
    src: "./fonts/GeistMonoVF.woff",
    variable: "--font-geist-mono",
    weight: "100 900",
});

export const outfit: NextFontWithVariable = Outfit({
    variable: "--font-outfit",
    subsets: ['latin']
})

export const metadata: Metadata = {
    title: "BeatGear",
    description: "Rent out your equipment",
};

export default function RootLayout({children,}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="de">
            <body
                className={`${geistSans.variable} ${geistMono.variable} ${outfit.variable} antialiased bg-white text-slate-700`}
            >
                {children}
            </body>
        </html>
    );
}
