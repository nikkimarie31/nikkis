/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx,html}'],
  safelist: [
    // Baby Blue variations
    'bg-babyBlue', 'text-babyBlue', 'border-babyBlue',
    'bg-babyBlue/10', 'bg-babyBlue/20', 'bg-babyBlue/30',
    'border-babyBlue/20', 'border-babyBlue/30', 'border-babyBlue/50',
    
    // Dark mode essentials
    'dark:bg-darkGray', 'dark:bg-gray-800', 'dark:bg-gray-900',
    'dark:text-white', 'dark:text-gray-300', 'dark:text-babyBlue',
    'dark:border-babyBlue/20', 'dark:border-babyBlue/30',
    
    // Button states
    'hover:bg-babyBlue', 'hover:text-darkGray', 'hover:shadow-lg',
    'transition-all', 'duration-300',
    
    // Light mode
    'bg-white', 'text-darkGray', 'text-gray-600', 'text-gray-900',
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
        // Primary baby blue palette
        babyBlue: {
          50: '#f0f9ff',
          100: '#e0f2fe', 
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#89CFF0', // Your main baby blue
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        
        // Enhanced gray palette
        darkGray: '#1a1a1a',
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#2d2d2d',
          850: '#242424', // Custom shade
          900: '#1a1a1a',
          950: '#111111',
        },
        
        // Accent colors for variety
        accent: {
          blue: '#89CFF0',
          dark: '#1a1a1a',
        }
      },
      
      fontFamily: {
        sans: ['Roboto', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(137, 207, 240, 0.5)' },
          '100%': { boxShadow: '0 0 30px rgba(137, 207, 240, 0.8)' },
        },
      },
      
      boxShadow: {
        'glow': '0 0 20px rgba(137, 207, 240, 0.5)',
        'glow-lg': '0 0 30px rgba(137, 207, 240, 0.8)',
      },
      
      backdropBlur: {
        xs: '2px',
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