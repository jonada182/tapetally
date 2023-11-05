"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Tracks from "@/components/Tracks";
import Artists from "@/components/Artists";
import useGetTrends from "@/hooks/useGetTrends";
import Image from "next/image";
import useGetToken from "@/hooks/useGetToken";
import { TimeRange } from "./types";
import { HttpStatusCode } from "axios";

export default function Home() {
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [authCode, setAuthCode] = useState<string | null>(null);
    const [timeRange, setTimeRange] = useState<TimeRange>(TimeRange.Medium);
    const searchParams = useSearchParams();
    const router = useRouter();
    const {
        data: trends,
        error: trendsError,
        isLoading: trendsIsLoading,
        refetch,
    } = useGetTrends({
        accessToken: accessToken,
        timeRange: timeRange,
    });
    const {
        data: tokenData,
        error: tokenError,
        isLoading: tokenIsLoading,
    } = useGetToken({ code: authCode });
    const isLoading = trendsIsLoading || tokenIsLoading;
    const error = trendsError || tokenError;

    useEffect(() => {
        const storedAccessToken = sessionStorage.getItem("access_token");
        setAccessToken(storedAccessToken);
    }, []);

    useEffect(() => {
        const code = searchParams.get("code");
        const error = searchParams.get("error");
        if (code && code !== authCode) {
            setAuthCode(code);
        } else if (error) {
            console.log("Error occured:", error);
        }

        return () => {
            router.replace(window.location.pathname);
        };
    }, [router, searchParams]);

    useEffect(() => {
        if (tokenData && tokenData.access_token) {
            setAccessToken(tokenData.access_token);
            sessionStorage.setItem("access_token", tokenData.access_token);
        }
    }, [tokenData]);

    useEffect(() => {
        if (trendsError && trendsError?.response?.status == 401) {
            setAccessToken(null);
            sessionStorage.removeItem("access_token");
        }
    }, [trendsError]);

    useEffect(() => {
        if (accessToken) {
            refetch();
        }
    }, [accessToken, timeRange]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="flex h-full max-w-6xl w-full flex-col justify-stretch items-center">
            {!accessToken ? (
                <Link
                    className="h-12 font-sans min-w-max px-6 text-white bg-green-500 hover:bg-green-600 rounded flex gap-2 items-center"
                    href="/api/login"
                >
                    <Image
                        src="/spotify.png"
                        alt=""
                        loading="lazy"
                        width={24}
                        height={24}
                    />
                    Login with Spotify
                </Link>
            ) : (
                <>
                    <div className="grid grid-cols-3 h-full w-full max-w-xs gap-1 mb-8">
                        <button
                            onClick={() => setTimeRange(TimeRange.Short)}
                            className={`vintage-btn ${
                                timeRange === TimeRange.Short && "active"
                            } transition-all font-mono uppercase text-xs bg-amber-400 text-white`}
                        >
                            Last 30 Days
                        </button>
                        <button
                            onClick={() => setTimeRange(TimeRange.Medium)}
                            className={`vintage-btn ${
                                timeRange === TimeRange.Medium && "active"
                            } transition-all font-mono uppercase text-xs bg-amber-600 text-white`}
                        >
                            Last 6 months
                        </button>
                        <button
                            onClick={() => setTimeRange(TimeRange.Long)}
                            className={`vintage-btn ${
                                timeRange === TimeRange.Long && "active"
                            } transition-all font-mono uppercase text-xs bg-amber-900 text-white`}
                        >
                            Last Year
                        </button>
                    </div>
                    <div className="flex flex-col md:flex-row gap-4 align-middle justify-stretch w-full">
                        <Artists artists={trends?.artists} />
                        <Tracks tracks={trends?.tracks} />
                    </div>
                </>
            )}
            {error &&
                error.response?.status !== HttpStatusCode.Unauthorized && (
                    <div className="p-4 my-8 font-mono uppercase text-sm flex justify-center align-middle bg-red-100 text-red-900 w-full">
                        {`Oops! An error has ocurred`}
                    </div>
                )}
        </div>
    );
}
