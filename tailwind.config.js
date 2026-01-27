const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],
    darkMode: 'class', // Activer le mode sombre avec la classe 'dark'
    
    theme: {
        extend: {
  fontFamily: {
    sans: ['Inter', 'system-ui', 'sans-serif'],
  },
  colors: {
    primary: {
      DEFAULT: '#1E3A8A',   // Bleu profond
      light: '#3B82F6',
      dark: '#1E40AF',
    },
    background: '#F8FAFC',
    surface: '#FFFFFF',
    muted: '#64748B',
  },
  boxShadow: {
    soft: '0 12px 32px rgba(0,0,0,0.08)',
    glow: '0 0 0 3px rgba(59,130,246,0.35)',
  },
  borderRadius: {
    xl: '1rem',
  },
}

    },
    plugins: [],
};
