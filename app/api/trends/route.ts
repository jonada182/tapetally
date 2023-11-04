import axios, { AxiosError, HttpStatusCode } from "axios";
import { NextResponse } from "next/server";
import { stringify } from "querystring";
import {
    ArtistsAPIResponse,
    TracksAPIResponse,
    Trends,
    artistMapper,
    trackMapper,
} from "@/app/types";
import data from "./data.json";

enum TimeRanges {
    Short = "short_term",
    Medium = "medium_term",
    Long = "long_term",
}

const handleErrorResponse = (error: AxiosError) => {
    return NextResponse.json(
        { error: error.message },
        {
            status:
                error.response?.status || HttpStatusCode.InternalServerError,
        },
    );
};

export async function GET(request: Request) {
    const authorization = request.headers.get("Authorization");
    if (authorization && authorization.startsWith("Bearer")) {
        const accessToken = authorization.replace("Bearer ", "");

        if (process.env.MOCK_API) {
            return NextResponse.json(data);
        }

        const trends: Trends = {
            artists: [],
            tracks: [],
            genres: [],
        };

        const spotifyTrendsURL = "https://api.spotify.com/v1/me/top";
        const headers = {
            Authorization: `Bearer ${accessToken}`,
        };
        const queryParams = stringify({
            limit: 10,
            time_range: TimeRanges.Medium,
        });

        try {
            const artistsResponse = await axios
                .get<ArtistsAPIResponse>(
                    `${spotifyTrendsURL}/artists?${queryParams}`,
                    {
                        headers: headers,
                    },
                )
                .then((response) => {
                    return response.data?.items;
                });

            trends.artists = artistsResponse.map(artistMapper);

            const tracksResponse = await axios
                .get<TracksAPIResponse>(
                    `${spotifyTrendsURL}/tracks?${queryParams}`,
                    {
                        headers: headers,
                    },
                )
                .then((response) => {
                    return response.data?.items;
                });

            trends.tracks = tracksResponse.map(trackMapper);

            const genres = new Map<string, number>();

            trends.artists?.forEach((artist) => {
                if (artist.genres && artist.genres.length > 0) {
                    artist.genres.forEach((genre) => {
                        const currentGenre = genres.get(genre);
                        genres.set(genre, currentGenre ? currentGenre + 1 : 1);
                    });
                }
            });

            trends.genres = Array.from(genres.entries())
                .sort((a, b) => b[1] - a[1])
                .slice(0, 10)
                .map(([key]) => key);
        } catch (error: any) {
            return handleErrorResponse(error);
        }

        return NextResponse.json(trends);
    }
}
