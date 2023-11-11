/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                hostname: "*",
            },
        ],
    },
    experimental: {
        serverComponentsExternalPackages: ["puppeteer", "@sparticuz/chromium"],
    },
};

module.exports = nextConfig;
