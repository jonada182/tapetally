import axios from "axios";
import { NextResponse } from "next/server";
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
    try {
        const { searchParams } = new URL(request.url);
        const refreshToken = searchParams.get("refresh_token");
        if (!refreshToken)
            return NextResponse.json({ error: "No access token provided" });

        const formData = new URLSearchParams();
        formData.append("grant_type", "refresh_token");
        formData.append("refresh_token", refreshToken);
        const data = await axios
            .post<UserAccessToken>(apiUrl, formData, {
                headers: getHeaders(),
            })
            .then((response) => response.data);

        if (data.access_token) {
            return NextResponse.json(data);
        }
    } catch (error: any) {
        return NextResponse.json({ error: error.message });
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
        return;

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
        return NextResponse.json({ error: error.message });
    }
}
