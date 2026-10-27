/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#4F46E5',
          accent: '#22D3EE',
        },
        surface: {
          page: '#09090B',
          card: '#18181B',
        },
        text: {
          primary: '#F4F4F5',
          muted: '#A1A1AA',
        },
        type: {
          feature: '#38BDF8',
          bug: '#F472B6',
        },
        due: {
          safe: '#10B981',
          warning: '#FACC15',
          overdue: '#FF2A54',
          neutral: '#71717A',
        },
      },
      fontFamily: {
        heading: ['"Space Grotesk"', 'sans-serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
};