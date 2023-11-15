import { NextResponse } from "next/server";
import { HttpStatusCode } from "axios";
import querystring from "querystring";
import { randomBytes } from "crypto";
import { handleErrorResponse } from "@/app/api/utils";

export const revalidate = 0;

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
        const scope =
            "user-top-read user-read-email playlist-modify-public ugc-image-upload";
        const redirectURI = process.env.SPOTIFY_REDIRECT_URI;

        if (process.env.MOCK_API === "true") {
            return NextResponse.redirect(redirectURI + "?code=test");
        }
        const authURL =
            "https://accounts.spotify.com/authorize?" +
            querystring.stringify({
                response_type: "code",
                client_id: process.env.SPOTIFY_CLIENT_ID,
                scope: scope,
                redirect_uri: redirectURI,
                state: state,
                // show_dialog: true,
            });
        return NextResponse.redirect(authURL, 301);
    } catch (error: any) {
        return handleErrorResponse(error);
    }
}
