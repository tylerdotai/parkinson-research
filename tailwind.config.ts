/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        primary: '#2D5BFF',
        secondary: '#10B981',
        accent: '#F59E0B',
        background: '#F8FAFC',
        foreground: '#1E293B',
      },
    },
  },
  plugins: [],
}
