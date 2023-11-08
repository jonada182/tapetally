import { NextResponse } from "next/server";
import puppeteer from "puppeteer";

export async function GET(request: Request) {
    const authorization = request.headers.get("Authorization");
    if (authorization && authorization.startsWith("Bearer")) {
        const accessToken = authorization.replace("Bearer ", "");

        const browser = await puppeteer.launch({ headless: "new" });
        const page = await browser.newPage();

        await page.setViewport({ width: 1080, height: 1920 });
        await page.goto("http://localhost:3000?print=true");
        await page.evaluate((accessToken) => {
            localStorage.setItem("access_token", accessToken);
        }, accessToken);
        try {
            // Wait for an element with a specific selector to appear (timeout after 10 seconds)
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
