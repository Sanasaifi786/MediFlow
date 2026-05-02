/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        azure: {
          DEFAULT: '#007FFF',
          light: '#E6F2FF',
          dark: '#0059B2',
        },
        turquoise: {
          DEFAULT: '#30D5C8',
          light: '#EAF9F8',
          dark: '#25A399',
        }
      }
    }
  },
  plugins: [],
}
