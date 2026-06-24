/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./hooks/**/*.{js,jsx,ts,tsx}",
    "./data/**/*.{js,jsx,ts,tsx}",
    "./services/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        deepSea: "#0B132B",
        midnight: "#1C2541",
        bioluminescent: "#5BC0BE",
        dawn: "#FFD166",
        glass: "rgba(255, 255, 255, 0.05)",
      },
    },
  },
  plugins: [],
};