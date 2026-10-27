/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        feature: '#38BDF8',
        bug: '#F472B6',
        'brand-primary': '#4F46E5',
        'brand-accent': '#22D3EE',
        'surface-page': '#09090B',
        'surface-card': '#18181B',
        'text-primary': '#F4F4F5',
        'text-muted': '#A1A1AA',
        'type-feature': '#38BDF8',
        'type-bug': '#F472B6',
        'due-safe': '#10B981',
        'due-warning': '#FACC15',
        'due-overdue': '#FF2A54',
        'due-neutral': '#71717A',
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