import axios from "axios";
import { NextResponse } from "next/server";
import { stringify } from "querystring";
import {
    ArtistsAPIResponse,
    TimeRange,
    TracksAPIResponse,
    Trends,
    artistMapper,
    trackMapper,
} from "@/app/types";
import { handleErrorResponse } from "@/app/api/utils";
import data from "./data.json";

type RequestParams = {
    params: {
        timeRange: TimeRange;
    };
};

export async function GET(request: Request, { params }: RequestParams) {
    const authorization = request.headers.get("Authorization");
    if (authorization && authorization.startsWith("Bearer")) {
        const accessToken = authorization.replace("Bearer ", "");
        if (process.env.MOCK_API === "true") {
            return NextResponse.json(data);
        }

        const trends: Trends = {
            artists: [],
            tracks: [],
        };

        const spotifyTrendsURL = "https://api.spotify.com/v1/me/top";
        const headers = {
            Authorization: `Bearer ${accessToken}`,
        };
        const queryParams = stringify({
            limit: 5,
            time_range: params.timeRange || TimeRange.Medium,
        });

        await Promise.resolve(() =>
            setTimeout(() => console.log("done"), 5000),
        );

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
        } catch (error: any) {
            return handleErrorResponse(error);
        }

        return NextResponse.json(trends);
    }
}
