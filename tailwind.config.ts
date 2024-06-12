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
    },
  },
  darkMode: 'class',
  plugins: [nextui()],
};
export default config;
