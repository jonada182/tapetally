/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "i.scdn.co",
            },
        ],
    },
    experimental: {
        serverComponentsExternalPackages: ["puppeteer"],
    },
};

module.exports = nextConfig;
