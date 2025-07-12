/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx,html}",  // ✅ adjust based on your project structure
    "./public/index.html"               // ✅ include if you use any HTML outside src
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
