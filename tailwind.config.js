/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{ts,tsx,jsx,js}'
  ],
  darkMode: 'class',
  plugins: [],
  theme: {
    extend: {
      colors: {
        dark: {
          "50": "#E8E8E8",
          "100": "#CFCFCF",
          "200": "#A1A1A1",
          "300": "#707070",
          "400": "#424242",
          "500": "#121212",
          "600": "#0F0F0F",
          "700": "#0A0A0A",
          "800": "#080808",
          "900": "#030303"
        }
      }
    }
  }
}
