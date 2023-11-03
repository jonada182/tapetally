"use client"
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios"
import Link from "next/link";
import { Artist, TokenResponse, Track, TrendAPIResponse } from "./types";

export default function Home() {
    const [accessToken, setAccessToken] = useState<string | null>(null)
    const [authCode, setAuthCode] = useState<string | null>(null)
    const [artists, setArtists] = useState<Artist[] | null>(null)
    const [tracks, setTracks] = useState<Track[] | null>(null)
    const [loading, setLoading] = useState(false)
    const searchParams = useSearchParams()
    const router = useRouter()

    const getAccessToken = (code: string) => {
        axios.post<TokenResponse>("/api/token", { code: code })
            .then((response) => {
                const data = response.data;
                if (data && data.access_token) {
                    sessionStorage.setItem("access_token", data.access_token)
                    setAccessToken(data.access_token)
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }

    const getTrends = (type: "artists" | "tracks") => {
        setLoading(true)
        axios.get<TrendAPIResponse>(`https://api.spotify.com/v1/me/top/${type}?limit=10`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }).then((response) => {
            if (response.data) {
                if (type == "artists") {
                    setArtists(response.data.items)
                } else {
                    setTracks(response.data.items)
                }
            }
        }).catch((error) => {
            console.log(error.response)
            if (error.response?.status == 401) {
                sessionStorage.removeItem("access_token")
                setAccessToken(null)
            }
            console.log(`Error ocurred: %s`, error.message)
        }).finally(() => {
            setLoading(false)
        })
    }

    useEffect(() => {
        const storedAccessToken = sessionStorage.getItem("access_token")
        setAccessToken(storedAccessToken)
    }, [])

    useEffect(() => {
        if (accessToken) {
            getTrends("artists")
            getTrends("tracks")
        }
    }, [accessToken])

    useEffect(() => {
        const code = searchParams.get("code")
        const error = searchParams.get("error")
        if (code && code !== authCode) {
            setAuthCode(code);
        } else if (error) {
            console.log("Error occured:", error)
        }

        return () => {
            router.replace(window.location.pathname)
        }
    }, [router, searchParams])

    useEffect(() => {
        if (authCode) {
            getAccessToken(authCode)
        }
    }, [authCode])

    if (loading) {
        return "Loading..."
    }

    return (
        <main className="flex min-h-screen max-w-6xl mx-auto flex-col items-center justify-center p-12">
            <h1 className="p-4 mb-8 text-4xl">Vinylize Me</h1>
            {!accessToken ? (
                <Link className="p-4 text-black bg-white rounded" href="/api/login">Login</Link>
            ) : (
                <div className="flex gap-4 justify-stretch w-full flex-grow">
                    <div className="flex flex-col gap-4 w-1/2 flex-grow">
                        <h2 className="text-2xl">Top Artists</h2>
                        {artists && <h2>Top Artists</h2> && artists?.map((artist) => {
                            return (
                                <div className="bg-white text-black p-4 rounded flex flex-col align-middle items-center justify-stretch gap-4" key={artist?.id}>
                                    <h3 className="text-lg">{artist.name}</h3>
                                    {artist.images && artist.images[0] && <img className="object-cover w-full max-w-xs aspect-square rounded-full" src={artist.images[0]?.url} />}
                                </div>
                            );
                        })}
                    </div>
                    <div className="flex flex-col gap-4 w-1/2 flex-grow">
                        <h2 className="text-2xl">Top Tracks</h2>
                        {tracks && tracks?.map((track) => {
                            return (
                                <div className="bg-white text-black p-4 rounded flex flex-col align-middle items-center justify-stretch gap-4" key={track?.id}>
                                    <h3 className="text-lg">{`${track.artists[0].name} - ${track.name}`}</h3>
                                    {track.album.images && track.album.images[0] && <img className="object-cover w-full max-w-xs aspect-square rounded-full" src={track.album.images[0]?.url} />}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </main>
    )
}
