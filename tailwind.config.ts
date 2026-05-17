import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{vue,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        base: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
          950: '#020617',
        },
        accent: {
          50: '#EEF2FF',
          100: '#E0E7FF',
          200: '#C7D2FE',
          300: '#A5B4FC',
          400: '#818CF8',
          500: '#6366F1',
          600: '#4F46E5',
          700: '#4338CA',
          800: '#3730A3',
          900: '#312E81',
          950: '#1E1B4B',
        },
        glass: {
          light: 'rgba(255,255,255,0.7)',
          dark: 'rgba(30,30,46,0.7)',
          border: 'rgba(255,255,255,0.2)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      borderRadius: {
        glass: '14px',
      },
      boxShadow: {
        glass: '0 2px 8px rgba(0,0,0,0.04), 0 8px 32px rgba(0,0,0,0.08)',
        'glass-dark': '0 2px 8px rgba(0,0,0,0.2), 0 8px 32px rgba(0,0,0,0.3)',
        notch: '0 4px 24px rgba(0,0,0,0.06)',
      },
      backdropBlur: {
        glass: '16px',
      },
    },
  },
  plugins: [],
} satisfies Config
