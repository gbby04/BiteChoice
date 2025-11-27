/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'], // Added your font
      },
      colors: {
        'brand-dark': '#4A3B32',  // Your custom dark brown
        'brand-cream': '#FFF8F0', // Your custom cream
        // ... keep the previous colors if you want
        'app-bg': '#FFFBF5',
        'card-bg': '#FFFFFF',
        'brand-caramel': '#D97706',
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.8s ease-out forwards',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}