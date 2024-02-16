/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        fadeInOut: {
          '0%,  100%': { opacity:  0.50 },
          '50%': { opacity:  1 },
        },
      },
      animation: {
        fadeInOut: 'fadeInOut  2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
  
}

