import { HttpStatusCode } from "axios";
import { NextResponse } from "next/server";
import puppeteer, { Browser } from "puppeteer";

export async function GET(request: Request) {
    if (!process.env.BROWSERLESS_TOKEN || !process.env.SPOTIFY_REDIRECT_URI)
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
            let browser: Browser;
            if (process.env.NODE_ENV == "production") {
                console.log("Setting up remote browser");
                browser = await puppeteer.connect({
                    browserWSEndpoint: `wss://chrome.browserless.io?token=${process.env.BROWSERLESS_TOKEN}`,
                });
            } else {
                browser = await puppeteer.launch({ headless: "new" });
            }

            const page = await browser.newPage();
            await page.setViewport({ width: 1080, height: 1920 });
            await page.goto(`${process.env.SPOTIFY_REDIRECT_URI}?print=true`);
            await page.evaluate((accessToken) => {
                localStorage.setItem("access_token", accessToken);
            }, accessToken);
            await page.waitForSelector("#puppeteer-artists", {
                timeout: 10000,
            });
            console.log("Element found on the page.");

            const image = await page.screenshot({
                quality: 80,
                type: "jpeg",
                optimizeForSpeed: true,
            });
            await browser.close();
            const response = new Response(image);
            response.headers.set("Content-Type", "image/jpeg");
            return response;
        } catch (err: any) {
            return NextResponse.json({ error: err.message }, { status: 500 });
        }
    }
}
