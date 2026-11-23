/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#0c0d0f',
          card: '#15171a',
          cardHover: '#1c1f23',
          border: '#2c3138',
          input: '#0e1012',
          subtext: '#9ba1a8',
        },
        gold: {
          DEFAULT: '#d6b36a',
          light: '#f0d99e',
          dark: '#a8863f',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
