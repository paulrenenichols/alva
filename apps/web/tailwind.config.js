/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary Gold Palette (from design system)
        gold: {
          DEFAULT: '#FFD700',
          light: '#FFE44D',
          dark: '#E6C200',
          muted: '#FFF4CC',
        },
        // Secondary Blue Palette
        blue: {
          DEFAULT: '#007BFF',
          light: '#4DA3FF',
          dark: '#0056B3',
          muted: '#CCE5FF',
        },
        // Success Green
        green: {
          DEFAULT: '#28A745',
          light: '#5CB85C',
          dark: '#1E7E34',
          muted: '#D4EDDA',
        },
        // Danger Red
        red: {
          DEFAULT: '#D32F2F',
          light: '#EF5350',
          dark: '#B71C1C',
          muted: '#F8D7DA',
        },
        // Text Colors
        'text-primary': '#1F1F1F',
        'text-secondary': '#6F6F6F',
        'text-tertiary': '#A0A0A0',
        'text-inverse': '#FFFFFF',
        // Background Colors
        'bg-primary': '#FFFFFF',
        'bg-secondary': '#FAFAFA',
        'bg-tertiary': '#F0F0F0',
        // Border Colors
        'border-subtle': '#E5E5E5',
        'border-default': '#CCCCCC',
        'border-strong': '#A0A0A0',
        // Legacy aliases for compatibility
        primary: {
          50: '#FFF4CC', // gold-muted
          500: '#FFD700', // gold
          600: '#E6C200', // gold-dark
          900: '#1F1F1F', // text-primary
        },
        secondary: {
          50: '#F8FAFC', // bg-secondary
          500: '#6F6F6F', // text-secondary
          600: '#007BFF', // blue
          900: '#1F1F1F', // text-primary
        },
      },
      fontFamily: {
        sans: ['Inter', 'Helvetica', 'Arial', 'sans-serif'],
      },
      fontSize: {
        xs: ['12px', { lineHeight: '1.5' }],
        sm: ['13px', { lineHeight: '1.5' }],
        base: ['14px', { lineHeight: '1.5' }],
        md: ['16px', { lineHeight: '1.5' }],
        lg: ['18px', { lineHeight: '1.375' }],
        xl: ['22px', { lineHeight: '1.375' }],
        '2xl': ['28px', { lineHeight: '1.25' }],
        '3xl': ['36px', { lineHeight: '1.25' }],
      },
      spacing: {
        '0': '0',
        '1': '4px',
        '2': '8px',
        '3': '12px',
        '4': '16px',
        '5': '20px',
        '6': '24px',
        '8': '32px',
        '10': '40px',
        '12': '48px',
        '16': '64px',
        '20': '80px',
        '24': '96px',
      },
      borderRadius: {
        sm: '4px',
        DEFAULT: '8px',
        md: '8px',
        lg: '12px',
        xl: '16px',
        full: '9999px',
      },
      boxShadow: {
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        DEFAULT: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        focus: '0 0 0 3px rgba(255, 215, 0, 0.3)',
        error: '0 0 0 3px rgba(211, 47, 47, 0.2)',
      },
      transitionDuration: {
        fast: '100ms',
        DEFAULT: '150ms',
        moderate: '200ms',
        slow: '300ms',
        slower: '500ms',
      },
    },
  },
  plugins: [],
};
