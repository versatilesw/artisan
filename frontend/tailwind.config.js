/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#8B5CF6', // Light purple for buttons
          DEFAULT: '#7C3AED', // Main purple from Figma
          dark: '#6D28D9', // Darker shade for hover states
        },
        chat: {
          bg: '#F9FAFB', // Light background
          border: '#E5E7EB', // Border color
          text: '#374151', // Main text color
        }
      },
      borderRadius: {
        'chat': '1.5rem', // Chat container radius
      }
    },
  },
  plugins: [],
}
