import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                brand: {
                    charcoal: "#121212",
                    "charcoal-light": "#1a1a2e",
                    coral: "#FF6B6B",
                    gold: "#FFB800",
                },
            },
            keyframes: {
                shake: {
                    '0%, 100%': { transform: 'translateX(0)' },
                    '25%': { transform: 'translateX(-5px)' },
                    '50%': { transform: 'translateX(5px)' },
                    '75%': { transform: 'translateX(-5px)' },
                }
            },
            animation: {
                shake: 'shake 0.4s ease-in-out',
            }
        },
    },
    plugins: [],
};
export default config;
