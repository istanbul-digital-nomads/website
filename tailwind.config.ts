import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#fff1ed",
          100: "#ffe1d7",
          200: "#ffc1ae",
          300: "#ff9a80",
          400: "#f56d57",
          500: "#e34b32",
          600: "#c8351f",
          700: "#a42818",
          800: "#87241a",
          900: "#6f241c",
        },
        accent: {
          warm: "#d49a45",
          coral: "#ff7b61",
          green: "#2f8f7b",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "-apple-system", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      maxWidth: {
        prose: "65ch",
      },
    },
  },
  plugins: [],
};

export default config;
