/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Tells Tailwind to scan all React components
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0fdfa',
          600: '#0d9488',
          900: '#134e4a',
        }
      }
    },
  },
  plugins: [],
}