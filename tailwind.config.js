/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Unique color palette
        primary: {
          50: '#f4f7fe',
          100: '#e9effd',
          200: '#d3dffb',
          300: '#b0c5f7',
          400: '#86a2f1',
          500: '#647cea',
          600: '#4c5cdf',
          700: '#4149cd',
          800: '#363ca6',
          900: '#303583',
        },
        secondary: {
          50: '#fdf5f9',
          100: '#fbeaf3',
          200: '#f7d6e7',
          300: '#f2b5d3',
          400: '#e986b4',
          500: '#db5c95',
          600: '#c93d75',
          700: '#a82e5c',
          800: '#8b284c',
          900: '#722541',
        },
        dark: {
          100: '#1E1E2D',
          200: '#2B2B3F',
          300: '#323248',
          400: '#474761',
          500: '#565674',
          600: '#6D6D8F',
          700: '#92929F',
          800: '#CDCDDE',
          900: '#FFFFFF',
        },
      },
    },
  },
  plugins: [],
};