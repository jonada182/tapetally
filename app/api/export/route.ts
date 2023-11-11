import { HttpStatusCode } from "axios";
import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer";

async function getBrowser() {
    return puppeteer.launch({ headless: "new", args: ["--no-sandbox"] });
}

export async function GET(request: NextRequest) {
    const authorization = request.headers.get("Authorization");
    if (authorization && authorization.startsWith("Bearer")) {
        const accessToken = authorization.replace("Bearer ", "");
        try {
            const url = request.nextUrl.searchParams.get("url");
            if (!url) {
                return NextResponse.json(
                    { error: "No URL was provided with the request" },
                    { status: HttpStatusCode.BadRequest },
                );
            }
            console.log("Setting up browser/page settings");
            const browser = await getBrowser();
            const page = await browser.newPage();
            await page.setViewport({ width: 1080, height: 1920 });
            const decodedURL = decodeURIComponent(url);
            console.log("Visiting URL:", decodedURL)
            await page.goto(decodedURL + "&token=" + accessToken);
            await page.waitForNetworkIdle();
            await page.waitForSelector("#puppeteer-artists", {
                timeout: 5000,
            });

            console.log("Generating image...");
            const image = await page.screenshot({
                quality: 80,
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
