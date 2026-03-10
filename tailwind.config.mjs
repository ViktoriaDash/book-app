/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {

      screens: {
        'xs': '480px',
        'tablet': '768px',
        'desktop': '1440px',
      },
      
      colors: {
        'tl-pink': '#350846',   
        'tl-dark': '#3b3a6e',    
        'tl-bg': '#f9fafb',      
      },
    },
  },
  plugins: [],
};