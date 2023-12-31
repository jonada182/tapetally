import axios, { HttpStatusCode } from "axios";
import { NextResponse } from "next/server";
import { handleErrorResponse } from "@/app/api/utils";
import { UserAccessToken } from "@/app/types";

const apiUrl = "https://accounts.spotify.com/api/token";

const getHeaders = () => ({
    Authorization: `Basic ${Buffer.from(
        `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`,
    ).toString("base64")}`,
    "Content-Type": "application/x-www-form-urlencoded",
});

/**
 * Retrieve new access_token using refresh_token
 * @param request
 * @returns UserAccessToken | error
 */
export async function GET(request: Request) {
    if (!process.env.SPOTIFY_CLIENT_ID)
        return NextResponse.json(
            { error: "API environment setup is incomplete" },
            {
                status: HttpStatusCode.InternalServerError,
            },
        );

    try {
        const { searchParams } = new URL(request.url);
        const refreshToken = searchParams.get("refresh_token");
        if (!refreshToken || refreshToken == "undefined")
            return NextResponse.json(
                { error: "Invalid token" },
                { status: HttpStatusCode.BadRequest },
            );

        const formData = new URLSearchParams();
        formData.append("grant_type", "refresh_token");
        formData.append("refresh_token", refreshToken);
        formData.append("client_id", process.env.SPOTIFY_CLIENT_ID);
        const data = await axios
            .post<UserAccessToken>(apiUrl, formData, {
                headers: getHeaders(),
            })
            .then((response) => {
                if (response.data) {
                    return response.data;
                }
                console.log(response);
                throw new Error("invalid response");
            })
            .catch((error) => {
                throw error;
            });
        if (data && data.access_token) {
            return NextResponse.json(data);
        }

        console.log(data);
        return NextResponse.json(
            { error: "invalid response" },
            { status: HttpStatusCode.NotFound },
        );
    } catch (error: any) {
        return handleErrorResponse(error);
    }
}

/**
 * Retrieve access_token using authorization code
 * @param request
 * @returns UserAccessToken | error
 */
export async function POST(request: Request) {
    if (
        !process.env.SPOTIFY_CLIENT_ID ||
        !process.env.SPOTIFY_CLIENT_SECRET ||
        !process.env.SPOTIFY_REDIRECT_URI
    )
        return NextResponse.json(
            { error: "API environment setup is incomplete" },
            {
                status: HttpStatusCode.InternalServerError,
            },
        );

    try {
        if (process.env.MOCK_API === "true") {
            return NextResponse.json({ access_token: "some_token" });
        }

        const requestData = await request.json();
        const code = requestData?.code;
        if (!code) {
            NextResponse.json({ error: "Invalid authorization code" });
        }
        const formData = new URLSearchParams();
        formData.append("code", code);
        formData.append("redirect_uri", process.env.SPOTIFY_REDIRECT_URI);
        formData.append("grant_type", "authorization_code");
        const data = await axios
            .post<UserAccessToken>(apiUrl, formData, {
                headers: getHeaders(),
            })
            .then((response) => response.data);

        if (data.access_token) {
            return NextResponse.json(data);
        }
    } catch (error: any) {
        return handleErrorResponse(error);
    }
}
