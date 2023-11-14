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
import { useSpotifyPlaylist } from "@/hooks/useSpotifyPlaylist";

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
        createSpotifyPlaylist,
        progressMessage: spotifyPlaylistMessage,
        error: spotifyPlaylistError,
        isLoading: spotifyPlaylistIsLoading,
    } = useSpotifyPlaylist();

    const {
        exportImage,
        error: exportError,
        isLoading: exportIsLoading,
    } = useExportImage({ timeRange: timeRange });

    const error = trendsError || authError || exportError;

    useEffect(() => {
        const timeRangeParam = searchParams.get("time_range");
        if (timeRangeParam) {
            setTimeRange(timeRangeParam as TimeRange);
        }
    }, [searchParams]);

    const handleTimeRangeChange = useCallback(
        (timeRange: TimeRange) => {
            const params = new URLSearchParams();
            params.set("time_range", timeRange);
            router.push(`${pathname}?${params.toString()}`);
        },
        [pathname, router],
    );

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
                        <>
                            <div className="flex flex-col md:flex-row gap-4 align-middle justify-stretch w-full">
                                <Artists artists={trends?.artists} />
                                <Tracks tracks={trends?.tracks} />
                            </div>
                            {isAuthenticated && trends?.tracks && (
                                <div
                                    id="save-trends-container"
                                    className="flex flex-col align-middle justify-center gap-4 mt-8"
                                >
                                    <button
                                        className="disabled:animate-pulse transition-all px-4 py-2 text-vintage-dark text-2xl hover:text-white hover:bg-vintage-dark"
                                        onClick={() =>
                                            createSpotifyPlaylist({
                                                timeRange,
                                                tracks: trends?.tracks,
                                                topArtist: trends?.artists[0],
                                            })
                                        }
                                        disabled={spotifyPlaylistIsLoading}
                                    >
                                        {spotifyPlaylistIsLoading
                                            ? "Creating Mixtape..."
                                            : "Create Mixtape"}
                                    </button>
                                    {spotifyPlaylistMessage && (
                                        <div className="p-4 text-center font-mono animate-pulse">
                                            {spotifyPlaylistMessage}
                                        </div>
                                    )}
                                </div>
                            )}
                        </>
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
