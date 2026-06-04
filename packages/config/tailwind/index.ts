import type { Config } from 'tailwindcss';

export const sharedConfig: Partial<Config> = {
  theme: {
    extend: {
      colors: {
        sars: {
          50: '#f0f7ff',
          100: '#e0effe',
          200: '#bae0fd',
          300: '#7cc5fb',
          400: '#36a8f6',
          500: '#0c8ee7',
          600: '#0070c4',
          700: '#015a9e',
          800: '#064c82',
          900: '#0b416c',
          950: '#072949',
        },
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
};
