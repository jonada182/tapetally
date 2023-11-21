"use client";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { HttpStatusCode } from "axios";
import useGetTrends from "@/hooks/useGetTrends";
import { useSpotifyPlaylist } from "@/hooks/useSpotifyPlaylist";
import { useAuthContext } from "@/contexts/AuthContext";
import Tracks from "@/components/Tracks";
import Artists from "@/components/Artists";
import Filters from "@/components/Filters";
import Loading from "@/components/shared/Loading";
import { TimeRange } from "./types";
import SpotifyLogo from "@/public/img/spotify.png";

export default function Home() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const router = useRouter();
    const [timeRange, setTimeRange] = useState<TimeRange>(TimeRange.Long);
    const {
        isAuthenticated,
        isLoading: authLoading,
        error: authError,
        logOut,
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
        playlistData,
        progressMessage: spotifyPlaylistMessage,
        error: spotifyPlaylistError,
        isLoading: spotifyPlaylistIsLoading,
    } = useSpotifyPlaylist();

    const error = trendsError || authError || spotifyPlaylistError;

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
            className="flex h-full w-full max-w-6xl flex-col items-center justify-stretch"
        >
            {!isAuthenticated ? (
                <Link
                    className="flex h-12 min-w-max items-center gap-2 rounded bg-green-500 px-6 font-sans text-white hover:bg-green-600"
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
                            <div className="flex w-full flex-col justify-stretch gap-4 align-middle md:flex-row">
                                <Artists artists={trends?.artists} />
                                <Tracks tracks={trends?.tracks} />
                            </div>
                            {isAuthenticated && trends?.tracks && (
                                <div
                                    id="save-trends-container"
                                    className="mt-8 flex flex-col justify-center gap-4 align-middle"
                                >
                                    {!spotifyPlaylistMessage &&
                                        !spotifyPlaylistIsLoading &&
                                        !playlistData && (
                                            <button
                                                className="px-4 py-2 text-2xl text-vintage-dark transition-all hover:bg-vintage-dark hover:text-white disabled:animate-pulse"
                                                onClick={() =>
                                                    createSpotifyPlaylist({
                                                        timeRange,
                                                        tracks: trends?.tracks,
                                                        topArtist:
                                                            trends?.artists[0],
                                                    })
                                                }
                                                disabled={
                                                    spotifyPlaylistIsLoading
                                                }
                                            >
                                                Create Mixtape
                                            </button>
                                        )}
                                    {playlistData && (
                                        <Link
                                            className="px-4 py-2 text-2xl text-vintage-dark transition-all hover:bg-vintage-dark hover:text-white disabled:animate-pulse"
                                            href={
                                                playlistData.external_urls
                                                    .spotify
                                            }
                                            target="_blank"
                                            prefetch={false}
                                        >
                                            Open My Mixtape
                                        </Link>
                                    )}
                                    {spotifyPlaylistMessage && (
                                        <div className="animate-pulse p-4 text-center font-mono">
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
                    <div className="my-8 flex w-full justify-center bg-red-100 p-4 align-middle font-mono text-sm uppercase text-red-900">
                        {`Oops! An error has ocurred`}
                    </div>
                )}
            {isAuthenticated && (
                <button
                    onClick={() => logOut()}
                    className="my-4 bg-vintage-dark px-4 py-2 font-mono text-sm text-vintage-white transition-all hover:bg-vintage-brown"
                >
                    Log out
                </button>
            )}
        </div>
    );
}
