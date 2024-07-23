import type { Config } from 'tailwindcss';
import { nextui } from '@nextui-org/react';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      animation: {
        'pulse-faster': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      screens: {
        xs: '475px',
      },
      keyframes: {
        'bounce-higher': {
          '0%, 100%': {
            transform: 'translateY(-100%)',
            animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)',
          },
          '50%': {
            transform: 'translateY(0)',
            animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)',
          },
        },
      },
    },
  },
  darkMode: 'class',
  plugins: [nextui(), require('@tailwindcss/typography')],
};
export default config;
