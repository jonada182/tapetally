import axios, { HttpStatusCode } from "axios";
import { NextResponse } from "next/server";
import { ArtistsAPIResponse, TracksAPIResponse, Trends } from "@/app/types";

export async function GET(request: Request) {
  const authorization = request.headers.get("Authorization");
  if (authorization && authorization.startsWith("Bearer")) {
    const accessToken = authorization.replace("Bearer ", "");

    const trends: Trends = {
      artists: [],
      tracks: [],
    };

    try {
      trends.artists = await axios
        .get<ArtistsAPIResponse>(
          `https://api.spotify.com/v1/me/top/artists?limit=10`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        )
        .then((response) => {
          return response.data?.items;
        });
    } catch (error: any) {
      return NextResponse.json(
        { error: error.message },
        {
          status: error.response?.status || HttpStatusCode.InternalServerError,
        },
      );
    }

    try {
      trends.tracks = await axios
        .get<TracksAPIResponse>(
          `https://api.spotify.com/v1/me/top/tracks?limit=10`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        )
        .then((response) => {
          return response.data?.items;
        });
    } catch (error: any) {
      return NextResponse.json(
        { error: error.message },
        {
          status: error.response?.status || HttpStatusCode.InternalServerError,
        },
      );
    }

    return NextResponse.json(trends);
  }
}
