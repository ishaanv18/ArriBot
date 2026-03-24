/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Holographic Spatial Palette
                void: {
                    base: '#030014', // Deepest Void
                    dark: '#010008',
                    light: '#0F0B29',
                },
                cyan: {
                    DEFAULT: '#00F0FF',
                    dim: 'rgba(0, 240, 255, 0.2)',
                    glow: 'rgba(0, 240, 255, 0.6)',
                },
                violet: {
                    DEFAULT: '#7000FF',
                    dim: 'rgba(112, 0, 255, 0.2)',
                    glow: 'rgba(112, 0, 255, 0.6)',
                },
                glass: {
                    base: 'rgba(255, 255, 255, 0.03)',
                    border: 'rgba(255, 255, 255, 0.08)',
                    highlight: 'rgba(255, 255, 255, 0.1)',
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                display: ['Clash Display', 'sans-serif'], // Heavy Display Font
                mono: ['JetBrains Mono', 'monospace'],
            },
            backgroundImage: {
                'grid-pattern': "linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px)",
            },
            animation: {
                'spin-slow': 'spin 20s linear infinite',
                'pulse-fast': 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'glitch': 'glitch 1s linear infinite',
                'decode': 'decode 0.5s ease-out forwards',
            },
            keyframes: {
                glitch: {
                    '2%, 64%': { transform: 'translate(2px,0) skew(0deg)' },
                    '4%, 60%': { transform: 'translate(-2px,0) skew(0deg)' },
                    '62%': { transform: 'translate(0,0) skew(5deg)' },
                },
                decode: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' }
                }
            },
        },
    },
    plugins: [],
}
