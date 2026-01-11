/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        terra: {
          wood: {
            light: '#C19A6B',
            DEFAULT: '#8B5A2B',
            dark: '#5D4037',
          },
          gold: {
            light: '#FFD700',
            DEFAULT: '#FFA500',
            dark: '#DAA520',
          },
          green: {
            hp: '#32CD32',
            DEFAULT: '#228B22',
          },
          blue: {
            mp: '#1E90FF',
            DEFAULT: '#1E3A5F',
            light: '#4A7BA7',
          },
          red: {
            DEFAULT: '#DC143C',
          },
          bg: {
            DEFAULT: '#1A1A2E',
            light: '#252540',
            card: 'rgba(30, 58, 95, 0.9)',
          },
        },
      },
      backgroundImage: {
        'wood-pattern': "url(\"data:image/svg+xml,%3Csvg width='64' height='64' viewBox='0 0 64 64' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h64v4H0zM0 16h64v4H0zM0 32h64v4H0zM0 48h64v4H0z' fill='%238B5A2B' fill-opacity='0.15'/%3E%3C/svg%3E\")",
      },
      boxShadow: {
        'terra': '0 4px 0 0 #5D4037, 0 8px 16px rgba(0,0,0,0.4)',
        'terra-sm': '0 2px 0 0 #5D4037, 0 4px 8px rgba(0,0,0,0.3)',
        'gold-glow': '0 0 12px rgba(255, 215, 0, 0.5)',
      },
    },
  },
  plugins: [],
}
