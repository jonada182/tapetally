import type { Metadata } from "next";
import { Permanent_Marker } from "next/font/google";
import "./globals.css";
import Main from "@/components/Main";

const inter = Permanent_Marker({ subsets: ["latin"], weight: "400" });

export const metadata: Metadata = {
    title: "TapeTally",
    description: "Spotify trends on a retro spin",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <Main>{children}</Main>
            </body>
        </html>
    );
}
