/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './public/**/*.html',
    './public/**/*.js',
    './src/**/*.js',
    './src/**/*.jsx',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    }
  },
  darkMode: 'class',
  plugins: [],
}
