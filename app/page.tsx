"use client";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { HttpStatusCode } from "axios";
import Tracks from "@/components/Tracks";
import Artists from "@/components/Artists";
import useGetTrends from "@/hooks/useGetTrends";
import { TimeRange } from "./types";
import SpotifyLogo from "@/public/img/spotify.png";
import Filters from "@/components/Filters";
import { useAuthContext } from "@/contexts/AuthContext";
import Loading from "@/components/shared/Loading";
import { useExportImage } from "@/hooks/useExportImage";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function Home() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const router = useRouter();
    const [timeRange, setTimeRange] = useState<TimeRange>(TimeRange.Medium);
    const {
        isAuthenticated,
        isLoading: authLoading,
        error: authError,
    } = useAuthContext();

    const {
        data: trends,
        error: trendsError,
        isLoading: trendsIsLoading,
    } = useGetTrends({
        timeRange: timeRange,
    });

    const {
        exportImage,
        error: exportError,
        isLoading: exportIsLoading,
    } = useExportImage();

    const error = trendsError || authError || exportError;

    useEffect(() => {
        const timeRangeParam = searchParams.get("time_range");
        if (timeRangeParam) {
            setTimeRange(timeRangeParam as TimeRange);
        }
    }, [searchParams]);

    const handleTimeRangeChange = useCallback((timeRange: TimeRange) => {
        const params = new URLSearchParams(searchParams)
        params.set("time_range", timeRange)
        router.push(`${pathname}?${params.toString()}`)
    },[pathname, router, searchParams])

    if (authLoading) {
        return <Loading />;
    }

    return (
        <div
            id="page-container"
            className="flex h-full max-w-6xl w-full flex-col justify-stretch items-center"
        >
            {!isAuthenticated ? (
                <Link
                    className="h-12 font-sans min-w-max px-6 text-white bg-green-500 hover:bg-green-600 rounded flex gap-2 items-center"
                    href="/api/login"
                    prefetch={false}
                    id="spotify-login-btn"
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
                        handleOnClick={handleTimeRangeChange}
                    />
                    {trendsIsLoading ? (
                        <Loading message="Loading Spotify trends..." />
                    ) : (
                        <div className="flex flex-col md:flex-row gap-4 align-middle justify-stretch w-full">
                            <Artists artists={trends?.artists} />
                            <Tracks tracks={trends?.tracks} />
                        </div>
                    )}
                    {isAuthenticated && (
                        <div
                            id="save-trends-container"
                            className="flex justify-center"
                        >
                            <button
                                className="disabled:animate-pulse transition-all px-4 py-2 mt-8 text-vintage-dark text-2xl hover:text-white hover:bg-vintage-dark"
                                onClick={() => exportImage()}
                                disabled={exportIsLoading}
                                title="Save this page as an image"
                            >
                                {exportIsLoading
                                    ? "Saving trends..."
                                    : "Save my trends"}
                            </button>
                        </div>
                    )}
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
