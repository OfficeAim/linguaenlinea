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
                    coral: "#FF7F50",
                    gold: "#D4AF37",
                },
            },
        },
    },
    plugins: [],
};
export default config;
