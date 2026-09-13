import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ground: "var(--ground)",
        surface: "var(--surface)",
        "surface-raised": "var(--surface-raised)",
        ink: "var(--ink)",
        "ink-soft": "var(--ink-soft)",
        muted: "var(--muted)",
        border: "var(--border)",
        "border-strong": "var(--border-strong)",

        accent: "var(--accent)",
        "accent-2": "var(--accent-2)",
        "accent-hover": "var(--accent-hover)",
        "accent-soft": "var(--accent-soft)",
        "on-accent": "var(--on-accent)",

        "level-1": "var(--level-1)",
        "level-2": "var(--level-2)",
        "level-3": "var(--level-3)",
        "level-track": "var(--level-track)",

        "t-touch": "var(--t-touch)",
        "t-status": "var(--t-status)",
        "t-wellbeing": "var(--t-wellbeing)",
      },
      fontSize: {
        "fluid-xs": ["var(--fs-xs)", { lineHeight: "1.5" }],
        "fluid-sm": ["var(--fs-sm)", { lineHeight: "1.55" }],
        "fluid-base": ["var(--fs-base)", { lineHeight: "1.6" }],
        "fluid-lg": ["var(--fs-lg)", { lineHeight: "1.4" }],
        "fluid-xl": ["var(--fs-xl)", { lineHeight: "1.25" }],
        "fluid-2xl": ["var(--fs-2xl)", { lineHeight: "1.15" }],
        "fluid-3xl": ["var(--fs-3xl)", { lineHeight: "1.05" }],
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
      },
      spacing: {
        gutter: "var(--gutter)",
        section: "var(--space-section)",
        block: "var(--space-block)",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      keyframes: {
        "rise-in": {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "none" },
        },
      },
      animation: {
        "rise-in": "rise-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) both",
      },
    },
  },
  plugins: [],
};
export default config;
