import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#fdf2f1",
          100: "#fadbd8",
          200: "#f1a9a0",
          300: "#e74c3c",
          400: "#e74c3c",
          500: "#c0392b",
          600: "#a93226",
          700: "#922b21",
          800: "#7b241c",
          900: "#641e16",
          950: "#4a1711",
        },
        secondary: {
          DEFAULT: "#2c3e50",
          50: "#eef1f4",
          100: "#d5dce3",
          200: "#a9b7c5",
          300: "#7e93a7",
          400: "#526e89",
          500: "#2c3e50",
          600: "#243544",
          700: "#1c2b38",
          800: "#15212c",
          900: "#0d1720",
        },
        accent: {
          warm: "#f39c12",
          coral: "#e74c3c",
          green: "#27ae60",
        },
        surface: {
          light: "#ffffff",
          dark: "#1a1d27",
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
