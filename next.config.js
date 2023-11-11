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
        serverComponentsExternalPackages: ["puppeteer"],
    },
};

module.exports = nextConfig;
