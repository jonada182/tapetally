import querystring from "querystring";
import { NextResponse } from "next/server";
import { randomBytes } from "crypto";

const generateRandomString = (length: number) => {
  return randomBytes(Math.ceil(length / 2))
    .toString("hex")
    .slice(0, length);
};

export async function GET(request: Request) {
  if (
    !process.env.SPOTIFY_CLIENT_ID ||
    !process.env.SPOTIFY_CLIENT_SECRET ||
    !process.env.SPOTIFY_REDIRECT_URI
  )
    return;

  try {
    const state = generateRandomString(16);
    const scope = "user-top-read";
    const redirectURI = process.env.SPOTIFY_REDIRECT_URI;

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
    return NextResponse.json({ error: error.message });
  }
}