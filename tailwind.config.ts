import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--md-background)",
        surface: {
          DEFAULT: "var(--md-surface)",
          variant: "var(--md-surface-variant)",
          bright: "var(--md-surface-bright)",
          dim: "var(--md-surface-dim)",
          tint: "var(--md-surface-tint)",
          "container": "var(--md-surface-container)",
          "container-low": "var(--md-surface-container-low)",
          "container-high": "var(--md-surface-container-high)",
          "container-highest": "var(--md-surface-container-highest)",
          "container-lowest": "var(--md-surface-container-lowest)",
        },
        primary: {
          DEFAULT: "var(--md-primary)",
          container: "var(--md-primary-container)",
          fixed: "var(--md-primary-fixed)",
          "fixed-dim": "var(--md-primary-fixed-dim)",
        },
        "on-primary": {
          DEFAULT: "var(--md-on-primary)",
          container: "var(--md-on-primary-container)",
          fixed: "var(--md-on-primary-fixed)",
          "fixed-variant": "var(--md-on-primary-fixed-variant)",
        },
        secondary: {
          DEFAULT: "var(--md-secondary)",
          container: "var(--md-secondary-container)",
          fixed: "var(--md-secondary-fixed)",
          "fixed-dim": "var(--md-secondary-fixed-dim)",
        },
        "on-secondary": {
          DEFAULT: "var(--md-on-secondary)",
          container: "var(--md-on-secondary-container)",
          fixed: "var(--md-on-secondary-fixed)",
          "fixed-variant": "var(--md-on-secondary-fixed-variant)",
        },
        tertiary: {
          DEFAULT: "var(--md-tertiary)",
          container: "var(--md-tertiary-container)",
          fixed: "var(--md-tertiary-fixed)",
          "fixed-dim": "var(--md-tertiary-fixed-dim)",
        },
        "on-tertiary": {
          DEFAULT: "var(--md-on-tertiary)",
          container: "var(--md-on-tertiary-container)",
          fixed: "var(--md-on-tertiary-fixed)",
          "fixed-variant": "var(--md-on-tertiary-fixed-variant)",
        },
        "on-surface": {
          DEFAULT: "var(--md-on-surface)",
          variant: "var(--md-on-surface-variant)",
        },
        outline: {
          DEFAULT: "var(--md-outline)",
          variant: "var(--md-outline-variant)",
        },
        "inverse-surface": "var(--md-inverse-surface)",
        "inverse-on-surface": "var(--md-inverse-on-surface)",
        "inverse-primary": "var(--md-inverse-primary)",
        error: {
          DEFAULT: "var(--md-error)",
          container: "var(--md-error-container)",
        },
        "on-error": {
          DEFAULT: "var(--md-on-error)",
          container: "var(--md-on-error-container)",
        },
        "on-background": "var(--md-on-background)",

        // ADDED: Tailwind needs these explicitly defined to use them in from-* and to-* utilities
        "primary-gradient-start": "var(--primary-gradient-start)",
        "primary-gradient-end": "var(--primary-gradient-end)",
      },

      fontFamily: {
        headline: ["Cabinet Grotesk", "Inter", "sans-serif"],
        body: ["Satoshi", "Inter", "sans-serif"],
        label: ["Manrope", "Inter", "sans-serif"],
        inter: ["Inter", "sans-serif"],
        mono: ["ui-monospace", "JetBrains Mono", "monospace"],
      },

      boxShadow: {
        "glow-violet": "0 0 24px rgba(112,0,204,0.25)",
        "glow-violet-sm": "0 0 24px rgba(112,0,204,0.05)",
        "violet-cta": "0 0 32px rgba(112,0,204,0.40)",
      },

      transitionDuration: {
        "400": "400ms",
      },

      transitionTimingFunction: {
        soft: "cubic-bezier(0.16, 1, 0.3, 1)",
      },

      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        fadeInUp: {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        pulse: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.4" },
        },
        meshDrift: {
          from: { transform: "translate(0,0) rotate(0deg)" },
          to: { transform: "translate(2%,2%) rotate(3deg)" },
        },
      },

      animation: {
        shimmer: "shimmer 2s infinite linear",
        fadeInUp: "fadeInUp 0.5s cubic-bezier(0.16,1,0.3,1) forwards",
        pulse: "pulse 2s ease-in-out infinite",
        meshDrift: "meshDrift 20s ease-in-out infinite alternate",
      },

      backgroundImage: {
        "primary-gradient":
          "linear-gradient(135deg, var(--primary-gradient-start) 0%, var(--primary-gradient-end) 100%)",
      },
    },
  },
  plugins: [],
};

export default config;