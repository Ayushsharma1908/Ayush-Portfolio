/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Bebas Neue"', 'sans-serif'],
        serif: ['"Playfair Display"', 'serif'],
        body: ['"DM Sans"', 'sans-serif'],
      },
      colors: {
        red: { DEFAULT: '#c0392b', dark: '#8b1a1a', glow: '#ff2d2d' },
        grey: { DEFAULT: '#2a2a2a', light: '#555555', muted: '#888888', border: '#1e1e1e' },
        coal: { DEFAULT: '#0a0a0a', mid: '#0d0d0d', card: '#111111' },
      },
    },
  },
  plugins: [],
};
