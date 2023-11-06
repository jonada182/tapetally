"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { HttpStatusCode } from "axios";
import Tracks from "@/components/Tracks";
import Artists from "@/components/Artists";
import useGetTrends from "@/hooks/useGetTrends";
import useGetToken from "@/hooks/useGetToken";
import { TimeRange } from "./types";
import SpotifyLogo from "@/public/img/spotify.png";
import Filters from "@/components/Filters";

export default function Home() {
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [refreshToken, setRefreshToken] = useState<string | null>(null);
    const [authCode, setAuthCode] = useState<string | null>(null);
    const [timeRange, setTimeRange] = useState<TimeRange>(TimeRange.Medium);
    const searchParams = useSearchParams();
    const router = useRouter();
    const {
        data: tokenData,
        error: tokenError,
        isLoading: tokenIsLoading,
        refresh: refreshAccessToken,
    } = useGetToken({ code: authCode, refreshToken: refreshToken });
    const {
        data: trends,
        error: trendsError,
        isLoading: trendsIsLoading,
        refetch,
    } = useGetTrends({
        accessToken: accessToken,
        timeRange: timeRange,
    });
    const isLoading = trendsIsLoading || tokenIsLoading;
    const error = trendsError || tokenError;

    useEffect(() => {
        const storedAccessToken = sessionStorage.getItem("access_token");
        const storedRefreshToken = sessionStorage.getItem("refresh_token");
        setAccessToken(storedAccessToken);
        setRefreshToken(storedRefreshToken);
    }, []);

    useEffect(() => {
        const code = searchParams.get("code");
        const error = searchParams.get("error");
        if (code && code !== authCode) {
            setAuthCode(code);
            router.replace("/");
        } else if (error) {
            console.log("Error occured:", error);
        }
    }, [router, searchParams]);

    useEffect(() => {
        if (tokenData && tokenData.access_token) {
            setAccessToken(tokenData.access_token);
            setRefreshToken(tokenData.refresh_token);
            sessionStorage.setItem("access_token", tokenData.access_token);
            sessionStorage.setItem("refresh_token", tokenData.refresh_token);
        }
    }, [tokenData]);

    useEffect(() => {
        if (trendsError && trendsError?.response?.status == 401) {
            refreshAccessToken();
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
                    prefetch={false}
                >
                    <Image
                        src={SpotifyLogo}
                        alt=""
                        loading="lazy"
                        width={24}
                        height={24}
                    />
                    Login with Spotify
                </Link>
            ) : (
                <>
                    <Filters
                        timeRange={timeRange}
                        handleOnClick={setTimeRange}
                    />
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
