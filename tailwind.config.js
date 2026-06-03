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
        red: { DEFAULT: '#e74c3c', dark: '#c0392b', glow: '#ff7675' },
        grey: { DEFAULT: '#555555', light: '#a3a3a3', muted: '#c8c8c8', border: '#2e2e2e' },
        coal: { DEFAULT: '#0a0a0a', mid: '#0d0d0d', card: '#111111' },
      },
    },
  },
  plugins: [],
};
