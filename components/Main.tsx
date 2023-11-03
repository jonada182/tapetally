"use client";
import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";

type Props = {
  children: React.ReactNode;
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Retry failed queries up to 3 times
      retry: false,

      // Retry on network errors and status code 5xx
      retryOnMount: false,

      // Automatically refetch data when the window refocuses
      refetchOnWindowFocus: false,

      // Invalidate and refetch data every 10 minutes
      cacheTime: 60 * 60 * 1000,
      staleTime: 30 * 60 * 1000,

      // Global error handling for queries
      onError: (error: any) => {
        // You can log or handle errors globally here
        console.error("Query error:", error.message);
      },
    },
    mutations: {
      // Global error handling for mutations
      onError: (error: any) => {
        // You can log or handle errors globally here
        console.error("Mutation error:", error.message);
      },
    },
  },
});

const Main = ({ children }: Props) => {
  return (
    <QueryClientProvider client={queryClient}>
      <main className="flex min-h-screen flex-col items-center justify-center p-12">
        {children}
      </main>
    </QueryClientProvider>
  );
};

export default Main;
