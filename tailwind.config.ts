import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: '#080C14',
          raised: '#0D1320',
        },
        border: '#1C2840',
        teal: {
          DEFAULT: '#2EC4C4',
          glow: 'rgba(46,196,196,0.15)',
        },
        muted: '#607394',
        faint: '#3A4D6B',
        'green-live': '#22C55E',
      },
      fontFamily: {
        display: ['Sora', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'pulse-live': 'pulse-live 2s ease-in-out infinite',
        'fade-in': 'fade-in 0.2s ease-out',
      },
      keyframes: {
        'pulse-live': {
          '0%, 100%': { opacity: '1', boxShadow: '0 0 4px rgba(34,197,94,0.4)' },
          '50%': { opacity: '0.7', boxShadow: '0 0 12px rgba(34,197,94,0.7)' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
