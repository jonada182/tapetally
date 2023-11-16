import type { Metadata } from "next";
import { Permanent_Marker } from "next/font/google";
import "./globals.css";
import Main from "@/components/Main";
import { Suspense } from "react";
import Loading from "@/components/shared/Loading";

const inter = Permanent_Marker({ subsets: ["latin"], weight: "400" });

export const metadata: Metadata = {
    title: "TapeTally",
    description: "Your Spotify Rewind in a Mixtape",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <Suspense fallback={<Loading />}>
                    <Main>{children}</Main>
                </Suspense>
            </body>
        </html>
    );
}
