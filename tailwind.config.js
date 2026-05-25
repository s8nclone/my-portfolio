/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./components/**/*.{js,vue,ts}",
        "./layouts/**/*.vue",
        "./pages/**/*.vue",
        "./plugins/**/*.{js,ts}",
        "./app.vue",
        "./error.vue",
    ],
    darkMode: "class",
    theme: {
        extend: {
            fontFamily: {
                sans: ["Inter", "sans-serif"],
                mono: ["JetBrains Mono", "monospace"],
            },
            colors: {
                green: {
                    50: "#f0fdf4",
                    100: "#dcfce7",
                    200: "#bbf7d0",
                    300: "#86efac",
                    400: "#4ade80",
                    500: "#22c55e",
                    600: "#16a34a",
                    700: "#15803d",
                    800: "#166534",
                    900: "#14532d",
                    950: "#052e16",
                },
                primary: "#235347"
            },
            animation: {
                "fade-in-up": "fade-in-up 0.8s ease-out",
                "fade-in-down": "fade-in-down 0.8s ease-out",
                "fade-in-left": "fade-in-left 0.8s ease-out",
                "fade-in-right": "fade-in-right 0.8s ease-out",
                float: "float 6s ease-in-out infinite",
                "pulse-slow": "pulse 3s ease-in-out infinite",
            },
            keyframes: {
                "fade-in-up": {
                    "0%": {
                        opacity: "0",
                        transform: "translateY(30px)",
                    },
                    "100%": {
                        opacity: "1",
                        transform: "translateY(0)",
                    },
                },
                "fade-in-down": {
                    "0%": {
                        opacity: "0",
                        transform: "translateY(-30px)",
                    },
                    "100%": {
                        opacity: "1",
                        transform: "translateY(0)",
                    },
                },
                "fade-in-left": {
                    "0%": {
                        opacity: "0",
                        transform: "translateX(-30px)",
                    },
                    "100%": {
                        opacity: "1",
                        transform: "translateX(0)",
                    },
                },
                "fade-in-right": {
                    "0%": {
                        opacity: "0",
                        transform: "translateX(30px)",
                    },
                    "100%": {
                        opacity: "1",
                        transform: "translateX(0)",
                    },
                },
                float: {
                    "0%, 100%": {
                        transform: "translateY(0px)",
                    },
                    "50%": {
                        transform: "translateY(-20px)",
                    },
                },
            },
        },
    },
    plugins: [require("@tailwindcss/typography")],
};
