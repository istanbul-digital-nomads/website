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
          dark: "#1a1612",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "-apple-system", "sans-serif"],
        display: ["var(--font-display)", "var(--font-sans)", "system-ui"],
        mono: ["var(--font-mono)", "monospace"],
      },
      fontSize: {
        "display-sm": ["3.5rem", { lineHeight: "4rem", fontWeight: "800" }],
        "display-md": ["4rem", { lineHeight: "4.5rem", fontWeight: "800" }],
        "display-lg": ["4.5rem", { lineHeight: "5rem", fontWeight: "800" }],
        h1: ["2.75rem", { lineHeight: "3.25rem", fontWeight: "800" }],
        h2: ["2.25rem", { lineHeight: "2.75rem", fontWeight: "800" }],
        h3: ["1.75rem", { lineHeight: "2.25rem", fontWeight: "700" }],
        body: ["1rem", { lineHeight: "1.75rem" }],
        "body-lg": ["1.0625rem", { lineHeight: "1.875rem" }],
        "body-xl": ["1.125rem", { lineHeight: "2rem" }],
        eyebrow: [
          "0.6875rem",
          { lineHeight: "1rem", letterSpacing: "0.35em", fontWeight: "500" },
        ],
      },
      maxWidth: {
        prose: "65ch",
      },
    },
  },
  plugins: [],
};

export default config;
