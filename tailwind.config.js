/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'game-white': '#FFFFFF',
        'game-light-blue': '#8AC4E7',
        'game-dark-blue': '#2A344F',
      }
    },
  },
  plugins: [],
}
