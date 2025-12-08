import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'rice-paper': '#fdfbf7',
        'ink': '#2d2d2d',
        'pastel-pink': '#ffd6e7',
        'pastel-blue': '#d6e7ff',
        'pastel-yellow': '#fff9d6',
        'pastel-lavender': '#e7d6ff',
      },
      boxShadow: {
        'stack-sm': `
          0 1px 0 0 rgba(0, 0, 0, 0.08),
          0 2px 0 0 rgba(0, 0, 0, 0.06),
          0 3px 0 0 rgba(0, 0, 0, 0.04)
        `,
        'stack-floating': `
          0 2px 4px 0 rgba(0, 0, 0, 0.06),
          0 4px 8px 0 rgba(0, 0, 0, 0.08),
          0 8px 16px 0 rgba(0, 0, 0, 0.10),
          0 12px 24px 0 rgba(0, 0, 0, 0.12)
        `,
        'paper': `
          0 1px 3px 0 rgba(0, 0, 0, 0.08),
          0 1px 2px 0 rgba(0, 0, 0, 0.06)
        `,
        'paper-hover': `
          0 4px 6px -1px rgba(0, 0, 0, 0.1),
          0 2px 4px -1px rgba(0, 0, 0, 0.06)
        `,
      },
      fontFamily: {
        'handwriting': ['var(--font-handwriting)', 'cursive'],
        'sans': ['var(--font-sans)', 'system-ui', 'sans-serif'],
        'quicksand': ['var(--font-quicksand)', 'sans-serif'],
        'poppins': ['var(--font-poppins)', 'sans-serif'],
      },
      animation: {
        'shake': 'shake 0.5s cubic-bezier(.36,.07,.19,.97) both',
        'unfold': 'unfold 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        'float': 'float 3s ease-in-out infinite',
        'confetti-fall': 'confetti-fall 3s ease-out forwards',
      },
      keyframes: {
        shake: {
          '10%, 90%': { transform: 'translate3d(-1px, 0, 0)' },
          '20%, 80%': { transform: 'translate3d(2px, 0, 0)' },
          '30%, 50%, 70%': { transform: 'translate3d(-4px, 0, 0)' },
          '40%, 60%': { transform: 'translate3d(4px, 0, 0)' },
        },
        unfold: {
          '0%': { 
            transform: 'perspective(1000px) rotateX(0deg) scale(0.95)',
            opacity: '1',
          },
          '50%': {
            transform: 'perspective(1000px) rotateX(-90deg) scale(1)',
          },
          '100%': { 
            transform: 'perspective(1000px) rotateX(0deg) scale(1)',
            opacity: '1',
          },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'confetti-fall': {
          '0%': { transform: 'translateY(-100vh) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translateY(100vh) rotate(360deg)', opacity: '0' },
        },
      },
    },
  },
  plugins: [],
}
export default config
