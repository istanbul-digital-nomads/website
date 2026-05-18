import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  darkMode: "class",
  // Lucide React applies class names like `lucide-arrow-right` at render
  // time, so Tailwind's content scanner doesn't see them in source. Safelist
  // the directional icon classes that our RTL CSS rule targets so the rule
  // survives PostCSS purging.
  safelist: [
    { pattern: /^lucide-(arrow|chevron|move-up|move-down|corner-up|corner-down|circle-arrow|circle-chevron|square-arrow|square-chevron)-(left|right)$/ },
    "lucide-move-up-right",
    "lucide-move-down-right",
    "lucide-corner-down-right",
    "lucide-corner-up-right",
    "lucide-arrow-up-right",
    "lucide-arrow-down-right",
    "rtl-keep",
  ],
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
        // Design System v2 - "ink + paper" tokens. Backed by CSS custom
        // properties (space-separated RGB channels) so they flip between
        // light and dark and support Tailwind's `/opacity` modifier.
        // Dark values from docs/plan/design/files/tokens.jsx (canonical).
        ink: {
          0: "rgb(var(--ink-0) / <alpha-value>)",
          1: "rgb(var(--ink-1) / <alpha-value>)",
          2: "rgb(var(--ink-2) / <alpha-value>)",
          3: "rgb(var(--ink-3) / <alpha-value>)",
          4: "rgb(var(--ink-4) / <alpha-value>)",
          5: "rgb(var(--ink-5) / <alpha-value>)",
        },
        paper: {
          DEFAULT: "rgb(var(--paper) / <alpha-value>)",
          dim: "rgb(var(--paper-dim) / <alpha-value>)",
          mute: "rgb(var(--paper-mute) / <alpha-value>)",
          faint: "rgb(var(--paper-faint) / <alpha-value>)",
        },
        terracotta: {
          DEFAULT: "rgb(var(--terracotta) / <alpha-value>)",
          dim: "rgb(var(--terracotta-dim) / <alpha-value>)",
        },
        bosphorus: {
          DEFAULT: "rgb(var(--bosphorus) / <alpha-value>)",
          dim: "rgb(var(--bosphorus-dim) / <alpha-value>)",
        },
        "ferry-yellow": "rgb(var(--ferry-yellow) / <alpha-value>)",
        moss: "rgb(var(--moss) / <alpha-value>)",
        // Time-of-day accent, set by the `tod-*` class on <html>.
        tod: "rgb(var(--tod-accent) / <alpha-value>)",
        // Cinematic-palette semantic aliases (used by HeroLive).
        // Resolve to ink-0 (dark) / paper / ferry-yellow / terracotta so
        // they flip with theme like everything else.
        "deep-water": "rgb(var(--ink-0) / <alpha-value>)",
        cream: "rgb(var(--paper) / <alpha-value>)",
        gold: "rgb(var(--ferry-yellow) / <alpha-value>)",
        rose: "rgb(var(--terracotta) / <alpha-value>)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "-apple-system", "sans-serif"],
        display: ["var(--font-display)", "Georgia", "serif"],
        editorial: ["var(--font-editorial)", "Georgia", "serif"],
        grotesk: ["var(--font-grotesk)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      fontSize: {
        // Design System v2 scale (docs/plan/design DESIGN_SYSTEM.md §3).
        // Display weights are light (300); page titles 400; subsections 500.
        "display-2xl": [
          "9.25rem",
          { lineHeight: "0.9", letterSpacing: "-0.045em", fontWeight: "300" },
        ],
        "display-xl": [
          "6.75rem",
          { lineHeight: "0.92", letterSpacing: "-0.04em", fontWeight: "300" },
        ],
        "display-lg": [
          "5rem",
          { lineHeight: "0.95", letterSpacing: "-0.035em", fontWeight: "300" },
        ],
        h1: [
          "3.5rem",
          { lineHeight: "1", letterSpacing: "-0.03em", fontWeight: "400" },
        ],
        h2: [
          "2.375rem",
          { lineHeight: "1.05", letterSpacing: "-0.025em", fontWeight: "400" },
        ],
        h3: [
          "1.75rem",
          { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "400" },
        ],
        h4: [
          "1.375rem",
          { lineHeight: "1.15", letterSpacing: "-0.015em", fontWeight: "500" },
        ],
        lede: ["1.1875rem", { lineHeight: "1.45" }],
        body: ["1rem", { lineHeight: "1.55" }],
        meta: ["0.8125rem", { lineHeight: "1.5" }],
        mono: ["0.6875rem", { lineHeight: "1.5", letterSpacing: "0.06em" }],
        // Legacy keys kept for not-yet-redesigned pages.
        "display-sm": ["3.5rem", { lineHeight: "4rem", fontWeight: "800" }],
        "display-md": ["4rem", { lineHeight: "4.5rem", fontWeight: "800" }],
        "body-lg": ["1.0625rem", { lineHeight: "1.875rem" }],
        "body-xl": ["1.125rem", { lineHeight: "2rem" }],
        eyebrow: [
          "0.6875rem",
          { lineHeight: "1rem", letterSpacing: "0.35em", fontWeight: "500" },
        ],
      },
      transitionTimingFunction: {
        soft: "cubic-bezier(0.2, 0.7, 0.3, 1)",
      },
      transitionDuration: {
        fast: "140ms",
        mid: "280ms",
        slow: "520ms",
      },
      maxWidth: {
        prose: "65ch",
      },
    },
  },
  plugins: [],
};

export default config;
