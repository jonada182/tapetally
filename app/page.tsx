"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import { TokenResponse } from "./types";
import TopTracks from "@/components/Tracks/TopTracks";
import TopArtists from "@/components/Artists/TopArtists";
import useGetTrends from "@/hooks/useGetTrends";
import Image from "next/image";

export default function Home() {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [authCode, setAuthCode] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const {
    data: trends,
    error: trendsError,
    isLoading,
  } = useGetTrends({
    accessToken: accessToken,
  });

  const getAccessToken = (code: string) => {
    axios.post<TokenResponse>("/api/token", { code: code }).then((response) => {
      const data = response.data;
      if (data && data.access_token) {
        sessionStorage.setItem("access_token", data.access_token);
        setAccessToken(data.access_token);
      }
    });
  };

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
    if (authCode) {
      getAccessToken(authCode);
    }
  }, [authCode]);

  useEffect(() => {
    if (trendsError && trendsError?.response?.status) {
      setAccessToken(null);
      sessionStorage.removeItem("access_token");
    }
  }, [trendsError]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex min-h-screen max-w-6xl w-full flex-col justify-stretch items-center">
      {trendsError && (
        <div className="p-4 rounded flex justify-center align-middle bg-red-100 text-red-900 w-full font-light">
          {trendsError?.message}
        </div>
      )}
      <h1 className="p-4 mb-8 text-4xl">Vinylize Me</h1>
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
        <div className="flex flex-col md:flex-row gap-4 justify-stretch w-full">
          <TopArtists artists={trends?.artists} />
          <TopTracks tracks={trends?.tracks} />
        </div>
      )}
    </div>
  );
}
