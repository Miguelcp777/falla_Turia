/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                "primary": "#ef4444", // Changed to Red-500 for fire theme
                "primary-dark": "#b91c1c", // Red-700
                "accent": "#f59e0b", // Amber for fire highlights
                "background-light": "#f6f8f7",
                "background-dark": "#1a0b0b", // Dark red/brown tint for background
                "surface-dark": "#261010", // Slightly lighter dark red tint
            },
            fontFamily: {
                "display": ["Spline Sans", "sans-serif"],
                "body": ["Spline Sans", "sans-serif"]
            },
            borderRadius: {
                "DEFAULT": "1rem",
                "lg": "2rem",
                "xl": "3rem",
                "full": "9999px"
            },
            boxShadow: {
                'neo-dark': '8px 8px 16px #0f0505, -8px -8px 16px #250f0f',
                'neo-dark-inset': 'inset 4px 4px 8px #0f0505, inset -4px -4px 8px #250f0f',
                'fire-glow': '0 0 20px rgba(239, 68, 68, 0.4), 0 0 40px rgba(245, 158, 11, 0.2)',
            },
            animation: {
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'fire-flicker': 'flicker 2s infinite alternate',
                'fire-text': 'fire-text 3s ease infinite',
            },
            keyframes: {
                flicker: {
                    '0%, 100%': { opacity: '1' },
                    '50%': { opacity: '0.8' },
                },
                'fire-text': {
                    '0%': { backgroundPosition: '0% 50%' },
                    '50%': { backgroundPosition: '100% 50%' },
                    '100%': { backgroundPosition: '0% 50%' },
                }
            }
        },
    },
    plugins: [],
}
