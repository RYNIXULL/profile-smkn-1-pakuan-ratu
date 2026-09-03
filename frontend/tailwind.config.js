/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          50: '#f2f8f5',
          100: '#e1efe9',
          200: '#c5dfd5',
          300: '#9bc6b8',
          400: '#6ba896',
          500: '#488c79',
          600: '#357161',
          700: '#2a5b4f',
          800: '#1e3a2f', // Core Brand Forest
          900: '#142820', // Deep Forest
          950: '#0b1612',
        },
        cream: {
          50: '#fdfcf9',
          100: '#fbf9f4', // Core Brand Cream
          200: '#f6f2e8',
          300: '#ece3d2',
          400: '#decbb4',
        },
        sand: '#f3efe6',
        earth: {
          DEFAULT: '#8c5338',
          dark: '#6e3f29',
          light: '#b06f4f',
        },
        amberGold: {
          DEFAULT: '#d97706',
          hover: '#b45309',
        },
        warmOrange: '#e07a5f',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
