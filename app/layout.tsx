import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Main from "@/components/Main";

const inter = Poppins({ subsets: ["latin"], weight: ["300", "500", "700"] });

export const metadata: Metadata = {
    title: "Create Next App",
    description: "Generated by create next app",
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
