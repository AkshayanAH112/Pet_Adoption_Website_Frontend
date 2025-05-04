/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'pet-primary': '#4A90E2',
        'pet-secondary': '#FF6B6B',
        'pet-background': '#F4F4F4',
      },
    },
  },
  plugins: [],
}
