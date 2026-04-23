/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef7f1',
          100: '#d6ebdc',
          200: '#b0d8bc',
          300: '#83c195',
          400: '#57aa70',
          500: '#2f8a4d',
          600: '#216d3b',
          700: '#19542e',
          800: '#154326',
          900: '#123720',
        },
        neutral: {
          50: '#f7f8f7',
          100: '#f1f3f1',
          200: '#e3e7e3',
          300: '#cfd7d0',
          400: '#98a39b',
          500: '#67746a',
          600: '#49554b',
          700: '#354036',
          800: '#232b24',
          900: '#161c17',
        },
      },
      boxShadow: {
        soft: '0 8px 24px rgba(17, 24, 39, 0.06)',
        panel: '0 16px 40px rgba(17, 24, 39, 0.08)',
        lift: '0 24px 60px rgba(23, 37, 26, 0.10)',
      },
      backgroundImage: {
        'campus-grid':
          'linear-gradient(rgba(21, 67, 38, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(21, 67, 38, 0.05) 1px, transparent 1px)',
      },
    },
  },
  plugins: [],
};
