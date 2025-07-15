export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    
    // Production optimizations
    ...(process.env.NODE_ENV === 'production' && {
      '@fullhuman/postcss-purgecss': {
        content: [
          './index.html',
          './src/**/*.{js,ts,jsx,tsx}',
        ],
        safelist: [
          // Preserve dynamic classes
          /^animate-/,
          /^transition-/,
          /^duration-/,
          /^ease-/,
          // Baby blue theme classes
          /^bg-babyBlue/,
          /^text-babyBlue/,
          /^border-babyBlue/,
          // Dark mode classes
          /^dark:/,
        ],
        defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || [],
      },
      cssnano: {
        preset: ['default', {
          discardComments: {
            removeAll: true,
          },
          reduceIdents: false, // Keep animation names
        }]
      }
    })
  }
};