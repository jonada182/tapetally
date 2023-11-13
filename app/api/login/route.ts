import querystring from "querystring";
import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { HttpStatusCode } from "axios";
import { handleErrorResponse } from "@/app/api/utils";

const generateRandomString = (length: number) => {
    return randomBytes(Math.ceil(length / 2))
        .toString("hex")
        .slice(0, length);
};

export async function GET() {
    if (!process.env.SPOTIFY_CLIENT_ID || !process.env.SPOTIFY_REDIRECT_URI)
        return NextResponse.json(
            { error: "API environment setup is incomplete" },
            {
                status: HttpStatusCode.InternalServerError,
            },
        );

    try {
        const state = generateRandomString(16);
        const scope = "user-top-read";
        const redirectURI = process.env.SPOTIFY_REDIRECT_URI;

        if (process.env.MOCK_API === "true") {
            return NextResponse.redirect(redirectURI + "?code=test");
        }

        return NextResponse.redirect(
            "https://accounts.spotify.com/authorize?" +
                querystring.stringify({
                    response_type: "code",
                    client_id: process.env.SPOTIFY_CLIENT_ID,
                    scope: scope,
                    redirect_uri: redirectURI,
                    state: state,
                }),
            301,
        );
    } catch (error: any) {
        return handleErrorResponse(error);
    }
}
