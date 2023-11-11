import { HttpStatusCode } from "axios";
import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer";

async function getBrowser() {
    return puppeteer.launch({ headless: true });
}

export async function GET(request: NextRequest) {
    if (!process.env.SPOTIFY_REDIRECT_URI)
        return NextResponse.json(
            { error: "API environment setup is incomplete" },
            {
                status: HttpStatusCode.InternalServerError,
            },
        );
    const authorization = request.headers.get("Authorization");
    if (authorization && authorization.startsWith("Bearer")) {
        const accessToken = authorization.replace("Bearer ", "");
        try {
            const url = request.nextUrl.searchParams.get("url");
            if (!url) {
                return NextResponse.json({ error: "No URL was provided with the request"}, {status: HttpStatusCode.BadRequest});
            }
            console.log("Setting up browser/page settings")
            const browser = await getBrowser();
            const page = await browser.newPage();
            await page.setViewport({ width: 1080, height: 1920 });
            await page.goto(url);
            console.log("Setting up access token")
            await page.evaluate((accessToken) => {
                localStorage.setItem("access_token", accessToken);
            }, accessToken);
            await page.waitForSelector("#puppeteer-artists", {
                timeout: 5000,
            });

            console.log("Generating image...");
            const image = await page.screenshot({
                quality: 90,
                type: "jpeg",
            });
            if (browser) {
                await browser.close();
            }
            const response = new Response(image as Buffer);
            response.headers.set("Content-Type", "image/jpeg");
            return response;
        } catch (err: any) {
            return NextResponse.json({ error: err.message }, { status: 500 });
        }
    }
}
