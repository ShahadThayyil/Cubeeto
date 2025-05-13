/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./frontend/views/**/*.ejs"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        blue: {
          '50': '#f0f7ff',
          '100': '#e0eefe',
          '200': '#baddfd',
          '300': '#80c3fc',
          '400': '#3ba0f8',
          '500': '#1082eb',
          '600': '#0066cc',
          '700': '#0054ac',
          '800': '#00448d',
          '900': '#003a74',
        },
        orange: {
          '50': '#fff7ed',
          '100': '#ffeed5',
          '200': '#ffd9aa',
          '300': '#ffbc74',
          '400': '#ff9439',
          '500': '#ff6633',
          '600': '#ff4d00',
          '700': '#cc3c00',
          '800': '#a63100',
          '900': '#872b00',
        },
      },
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
      }
    },
  },
  plugins: [],
}