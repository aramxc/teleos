import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        theme: {
          bg: {
            primary: 'var(--background-primary)',
            secondary: 'var(--background-secondary)',
            accent: 'var(--background-accent)',
          },
          text: {
            primary: 'var(--text-primary)',
            secondary: 'var(--text-secondary)',
            accent: 'var(--text-accent)',
            dark: 'var(--text-dark)',
          },
          border: {
            primary: 'var(--border-primary)',
            secondary: 'var(--border-secondary)',
          },
          panel: {
            bg: 'var(--panel-background)',
            border: 'var(--panel-border)',
          },
          button: {
            primary: 'var(--button-primary)',
            secondary: 'var(--button-secondary)',
            hover: 'var(--button-hover)',
          },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
