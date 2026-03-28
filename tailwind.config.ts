import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: "#FF6B6B",
                "background-dark": "#0D0D0D",
                "card-dark": "#1a1a2e",
                "accent-gold": "#FFB800",
                brand: {
                    charcoal: "#121212",
                    "charcoal-light": "#1a1a2e",
                    coral: "#FF6B6B",
                    gold: "#FFB800",
                },
            },
            fontFamily: {
                display: ["var(--font-jakarta)", "Plus Jakarta Sans", "sans-serif"],
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
