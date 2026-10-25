/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FDFBF7',
          100: '#FAF6F0',
          200: '#F4ECE1',
          300: '#EBDDC9',
          400: '#DEC9AA',
        },
        maroon: {
          50: '#FBF0F1',
          100: '#F5D8DB',
          200: '#EAB2B8',
          500: '#8C2434',
          700: '#6B1724',
          800: '#52101A',
          900: '#3D0911',
        },
        ink: {
          50: '#F1F4FA',
          100: '#DFE7F4',
          200: '#C2D1EA',
          500: '#2A467A',
          700: '#1A2B4C',
          800: '#121F38',
          900: '#0B1322',
        },
        gold: {
          50: '#FCF9EF',
          100: '#F7F0D6',
          400: '#D4AA3A',
          500: '#C29B38',
          600: '#A48028',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
