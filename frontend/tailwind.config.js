/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'forensics-primary': '#0891b2',
        'forensics-secondary': '#4f46e5',
        'forensics-accent': '#06b6d4',
        'forensics-dark': '#0f172a',
        'forensics-surface': '#1e293b',
        'forensics-border': '#334155',
        'forensics-text': '#f8fafc',
        'forensics-text-secondary': '#cbd5e1',
      },
      fontFamily: {
        'mono': ['JetBrains Mono', 'Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace'],
      },
      animation: {
        'scan': 'scan 2s infinite',
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        scan: {
          '0%': { left: '-100%' },
          '100%': { left: '100%' }
        }
      }
    },
  },
  plugins: [],
}
