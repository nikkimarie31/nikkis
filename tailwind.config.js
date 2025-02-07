/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx,html}'],
  safelist: [
    'bg-neonGreen', 'text-darkGray',
    'dark:bg-gray-900',
    'text-neonGreen',
    'bg-gray-800',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
    },
    extend: {
      screens: {
        xs: '480px',
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
      },
      colors: {
        neonGreen: '#39ff14',
        darkGray: '#1a1a1a',
        gray: {
          800: '#2d2d2d',
          900: '#1a1a1a',
        },
      },
      fontFamily: {
        sans: ['Roboto', 'sans-serif'],
      },
      spacing: {
        '128': '32rem',
      },

    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
    require('tailwindcss-debug-screens'),
  ],
};
