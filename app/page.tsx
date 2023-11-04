"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import TopTracks from "@/components/TopTracks";
import TopArtists from "@/components/TopArtists";
import useGetTrends from "@/hooks/useGetTrends";
import Image from "next/image";
import useGetToken from "@/hooks/useGetToken";

export default function Home() {
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [authCode, setAuthCode] = useState<string | null>(null);
    const searchParams = useSearchParams();
    const router = useRouter();
    const {
        data: trends,
        error: trendsError,
        isLoading: trendsIsLoading,
    } = useGetTrends({
        accessToken: accessToken,
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

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="flex min-h-screen max-w-6xl w-full flex-col justify-stretch items-center">
            {error && (
                <div className="p-4 rounded flex justify-center align-middle bg-red-100 text-red-900 w-full font-light">
                    {error.message}
                </div>
            )}
            {!accessToken ? (
                <Link
                    className="h-12 min-w-max px-6 text-white bg-green-500 hover:bg-green-600 rounded flex gap-2 items-center"
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
                    <div className="flex flex-col md:flex-row gap-4 align-middle justify-stretch w-full">
                        <TopArtists artists={trends?.artists} />
                        <TopTracks tracks={trends?.tracks} />
                    </div>
                    <div className="grid grid-flow-row grid-cols-2 lg:grid-cols-5 gap-4 w-full mt-4">
                        {trends?.genres?.map((genre) => (
                            <div
                                key={genre.replaceAll(" ", "_")}
                                className="capitalize p-4 bg-black/30 text-lg text-center text-white rounded-lg"
                            >
                                {genre}
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
