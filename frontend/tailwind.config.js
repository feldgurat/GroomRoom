/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: '#FFF8F0',
        rose: {
          DEFAULT: '#D4A69A',
          dark: '#C08B7E',
        },
        mocha: {
          DEFAULT: '#8B7355',
          dark: '#5C4A3A',
        },
        sand: '#E8D5C4',
        sage: {
          DEFAULT: '#9CAF88',
          dark: '#7D9468',
        },
      },
      fontFamily: {
        body: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}