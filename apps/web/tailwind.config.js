/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
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
        chat: '#1D4ED8',
        linkedin: '#0077B5',
      },
      keyframes: {
        slideDown: {
          from: {
            transform: 'translateY(-20px)',
          },
          to: {
            transform: 'translateY(0)',
          },
        },
        recordingHeart: {
          '0%': {
            boxShadow: '0 0 0 0 rgba(59, 130, 246, 0)',
            filter: 'brightness(0.7)',
          },
          '25%': {
            boxShadow: '0 0 10px 4px rgba(59, 130, 246, 0.18)',
            filter: 'brightness(1.03)',
          },
          '50%': {
            boxShadow: '0 0 0 0 rgba(59, 130, 246, 0)',
            filter: 'brightness(1.2)',
          },
          '75%': {
            boxShadow: '0 0 8px 3px rgba(59, 130, 246, 0.12)',
            filter: 'brightness(1.02)',
          },
          '100%': {
            boxShadow: '0 0 0 0 rgba(59, 130, 246, 0)',
            filter: 'brightness(0.7)',
          },
        },
        dropBounce: {
          '0%': {
            transform: 'translateY(calc(-100vh - 60px))',
            opacity: '0',
          },
          '8%': {
            opacity: '1',
          },
          '30%': {
            transform: 'translateY(0)',
          },
          '45%': {
            transform: 'translateY(-40px)',
          },
          '60%': {
            transform: 'translateY(0)',
          },
          '72%': {
            transform: 'translateY(-14px)',
          },
          '84%': {
            transform: 'translateY(0)',
          },
          '100%': {
            transform: 'translateY(0)',
            opacity: '1',
          },
        },
        drawerIn: {
          '0%': {
            transform: 'translateY(12px) scale(.985)',
            opacity: '0',
          },
          '100%': {
            transform: 'translateY(0) scale(1)',
            opacity: '1',
          },
        },
        drawerOut: {
          '0%': {
            transform: 'translateY(0) scale(1)',
            opacity: '1',
          },
          '100%': {
            transform: 'translateY(12px) scale(.985)',
            opacity: '0',
          },
        },
      },
      animation: {
        'slide-down': 'slideDown 0.5s ease-out',
        recording: 'recordingHeart 1.2s ease-in-out infinite',
        'drop-bounce':
          'dropBounce 2s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'drawer-in': 'drawerIn 220ms cubic-bezier(.2,.9,.2,1) forwards',
        'drawer-out': 'drawerOut 220ms cubic-bezier(.2,.9,.2,1) forwards',
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
