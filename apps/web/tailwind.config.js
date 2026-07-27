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
        background: 'rgb(var(--color-background) / <alpha-value>)',
        card: 'rgb(var(--color-surface) / <alpha-value>)',
        header: 'rgb(var(--color-header) / <alpha-value>)',
        surface: {
          DEFAULT: 'rgb(var(--color-surface) / <alpha-value>)',
          muted: 'rgb(var(--color-surface-muted) / <alpha-value>)',
          strong: 'rgb(var(--color-surface-strong) / <alpha-value>)',
        },
        border: {
          DEFAULT: 'rgb(var(--color-border) / <alpha-value>)',
          strong: 'rgb(var(--color-border-strong) / <alpha-value>)',
        },
        foreground: {
          DEFAULT: 'rgb(var(--color-foreground) / <alpha-value>)',
          muted: 'rgb(var(--color-foreground-muted) / <alpha-value>)',
          subtle: 'rgb(var(--color-foreground-subtle) / <alpha-value>)',
        },
        overlay: 'rgb(var(--color-overlay) / <alpha-value>)',
        terminal: {
          bg: 'rgb(var(--color-terminal-bg) / <alpha-value>)',
          green: 'rgb(var(--color-terminal-green) / <alpha-value>)',
          accent: 'rgb(var(--color-terminal-accent) / <alpha-value>)',
        },
        brand: {
          DEFAULT: '#3B8640',
          700: '#2F6B33',
        },
        chat: '#1D4ED8',
        linkedin: '#0077B5',
      },
      fontFamily: {
        display: [
          '"Space Grotesk"',
          'ui-sans-serif',
          'system-ui',
          'sans-serif',
        ],
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
