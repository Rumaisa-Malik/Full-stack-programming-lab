/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        base: '#F8FAFC',
        surface: 'rgba(255, 255, 255, 0.7)',
        ink: '#0B1F3A',
        'ink-soft': '#3D5573',
        accent: '#1FA2FF',
        'accent-soft': '#BFE4FF',
        line: '#E2EBF3',
        success: '#1FC8A0',
        danger: '#FF5C72',
      },
      backgroundColor: {
        base: '#F8FAFC',
        surface: 'rgba(255, 255, 255, 0.7)',
      },
      textColor: {
        primary: '#0B1F3A',
        secondary: '#3D5573',
      },
      borderColor: {
        subtle: '#E2EBF3',
      },
      backdropBlur: {
        sm: '4px',
        md: '8px',
      },
      animation: {
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
};
