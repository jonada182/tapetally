import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic":
                    "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
            },
            colors: {
                "vintage-white": "#f6edcd",
                "vintage-cream": "#e8d197",
                "vintage-yellow": "#ffc13f",
                "vintage-orange": "#d15700",
                "vintage-brown": "#8e4d2d",
                "vintage-dark": "#504942",
            },
        },
    },
    plugins: [],
};
export default config;
