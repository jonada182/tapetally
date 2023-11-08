import chromium from "@sparticuz/chromium";
import { HttpStatusCode } from "axios";
import { NextResponse } from "next/server";
import puppeteer from "puppeteer-core";

async function getBrowser() {
    chromium.setHeadlessMode = true;
    return puppeteer.launch({
        args: [...chromium.args, "--hide-scrollbars", "--disable-web-security"],
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath(
            `https://github.com/Sparticuz/chromium/releases/download/v116.0.0/chromium-v116.0.0-pack.tar`,
        ),
        headless: chromium.headless,
        ignoreHTTPSErrors: true,
    });
}

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
            const browser = await getBrowser();
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
            const response = new Response(image);
            response.headers.set("Content-Type", "image/jpeg");
            if (browser) {
                await browser.close();
            }
            return response;
        } catch (err: any) {
            return NextResponse.json({ error: err.message }, { status: 500 });
        }
    }
}
