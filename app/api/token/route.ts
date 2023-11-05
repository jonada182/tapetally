import { UserAccessToken } from "@/app/types";
import axios from "axios";
import { NextResponse } from "next/server";

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
            .post<UserAccessToken>(
                "https://accounts.spotify.com/api/token",
                formData,
                {
                    headers: {
                        Authorization: `Basic ${Buffer.from(
                            `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`,
                        ).toString("base64")}`,
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                },
            )
            .then((response) => response.data);

        if (data.access_token) {
            return NextResponse.json({ access_token: data.access_token });
        }
    } catch (error: any) {
        return NextResponse.json({ error: error.message });
    }
}
