"use client";
import React from "react";
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
            staleTime: 15 * 60 * 1000,
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
    return (
        <QueryClientProvider client={queryClient}>
            <main className="flex min-h-screen flex-col items-center justify-center p-8 md:p-12">
                <div className="relative w-full px-4 mb-4 md:mb-8 flex flex-col justify-center items-center">
                    <h1 className="text-4xl md:text-5xl">tapetally</h1>
                    <p className="font-mono uppercase text-xs">
                        Spotify trends on a retro spin
                    </p>
                </div>
                <div className="w-full flex justify-center">{children}</div>
            </main>
        </QueryClientProvider>
    );
};

export default Main;
