/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#212830',
        card: '#262C36',
        header: '#151B23',
        terminal: {
          bg: '#071021',
          green: '#7EE787',
          accent: '#9AD1FF',
        },
        brand: {
          DEFAULT: '#347D39',
          700: '#2e6e31',
        },
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
