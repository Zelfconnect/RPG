/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#5E35B1', // Deep purple
          light: '#7E57C2',
          dark: '#4527A0'
        },
        secondary: {
          DEFAULT: '#2E7D32', // Emerald green
          light: '#43A047',
          dark: '#1B5E20'
        },
        accent: {
          DEFAULT: '#FFB300', // Gold
          light: '#FFCA28',
          dark: '#FF8F00'
        }
      }
    },
  },
  plugins: [],
} 