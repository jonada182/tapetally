"use client";
import { AuthContextProvider } from "@/contexts/AuthContext";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";

type Props = {
    children: React.ReactNode;
};

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
            retryOnMount: false,
            refetchOnWindowFocus: false,
            cacheTime: 30 * 60 * 1000,
            staleTime: 10 * 60 * 1000,
            onError: (error: any) => {
                console.error("Query error:", error.message);
            },
        },
        mutations: {
            onError: (error: any) => {
                console.error("Mutation error:", error.message);
            },
        },
    },
});

const Main = ({ children }: Props) => {
    const searchParams = useSearchParams();
    const [printView, setPrintView] = useState(false);

    useEffect(() => {
        const print = searchParams.get("print");
        if (print) {
            setPrintView(true);
        }
    }, [searchParams]);
    return (
        <QueryClientProvider client={queryClient}>
            <AuthContextProvider>
                <main
                    className={`flex min-h-screen flex-col items-center justify-center p-8 md:p-12 ${
                        printView && "print-view"
                    }`}
                >
                    <div
                        id="logo-container"
                        className="relative w-full px-4 mb-4 md:mb-8 flex flex-col justify-center items-center"
                    >
                        <h1 className="text-6xl">tapetally</h1>
                        <p className="font-mono uppercase text-xs">
                            Your Spotify Rewind in a Mixtape
                        </p>
                    </div>
                    <div className="w-full flex justify-center">{children}</div>
                </main>
            </AuthContextProvider>
        </QueryClientProvider>
    );
};

export default Main;
