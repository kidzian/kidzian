/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      keyframes: {
        blink: {
          '0%, 100%': { boxShadow: '0 0 0px rgba(0, 0, 0, 0)' },
          '50%': { boxShadow: '0 0 18px 4px rgba(244, 160, 36, 0.8)' }, // orange glow
        },
      },
      animation: {
        blink: 'blink 1.2s infinite',
      },
    },
  },
  plugins: [],
}

