/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          900: '#0B0E14',
          800: '#151A23',
          700: '#232D3F',
        },
        accent: {
          purple: '#8B5CF6',
          cyan: '#06B6D4',
          danger: '#EF4444',
          success: '#10B981',
          warning: '#F59E0B',
        }
      }
    },
  },
  plugins: [],
}