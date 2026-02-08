/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brown: {
          50: '#FBF4EE',
          100: '#F5E8D7',
          200: '#E6C8AB',
          300: '#D7A77E',
          400: '#C28A63',
          500: '#B07855',
          600: '#955E44',
          700: '#7B5A48',
          800: '#6B4A3A',
          900: '#4B2F24',
        },
      },
    },
  },
  plugins: [],
}
