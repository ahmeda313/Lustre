import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    colors: {
      transparent: "transparent",
      current: "currentColor",
      obsidian: "#0A0A0B",
      graphite: "#111113",
      carbon: "#1A1A1D",
      bone: "#EDE9E1",
      ink: "#0A0A0B",
      stone: "#9A968E",
      "stone-ink": "#5E5B55",
      brass: "#C6A664",
      "hairline-dark": "rgba(237,233,225,0.12)",
      "hairline-light": "rgba(10,10,11,0.14)",
    },
    fontFamily: {
      display: ["var(--font-instrument)", "Georgia", "Times New Roman", "serif"],
      sans: ["var(--font-geist)", "Helvetica Neue", "Arial", "sans-serif"],
      mono: ["var(--font-geist-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
    },
    fontSize: {
      "2xs": ["10px", { lineHeight: "1.2", letterSpacing: "0.14em" }],
      xs: ["12px", { lineHeight: "1.3", letterSpacing: "0.14em" }],
      sm: ["13px", { lineHeight: "1.45" }],
      base: ["15px", { lineHeight: "1.6" }],
      body: ["17px", { lineHeight: "1.65" }],
      lg: ["20px", { lineHeight: "1.5" }],
      xl: ["24px", { lineHeight: "1.3" }],
      "2xl": ["28px", { lineHeight: "1.2" }],
      h3: ["clamp(32px,3vw,40px)", { lineHeight: "1.05", letterSpacing: "-0.02em" }],
      h2: ["clamp(44px,6vw,96px)", { lineHeight: "0.98", letterSpacing: "-0.025em" }],
      hero: ["clamp(64px,9.5vw,152px)", { lineHeight: "0.92", letterSpacing: "-0.02em" }],
      price: ["clamp(56px,7vw,88px)", { lineHeight: "0.9", letterSpacing: "-0.03em" }],
      "price-lg": ["clamp(64px,7.5vw,96px)", { lineHeight: "0.9", letterSpacing: "-0.03em" }],
    },
    extend: {
      spacing: {
        section: "160px",
        "section-md": "112px",
        "section-sm": "80px",
      },
      maxWidth: {
        container: "1320px",
        prose: "62ch",
        measure: "52ch",
      },
      borderRadius: {
        none: "0",
        sm: "2px",
        DEFAULT: "2px",
        md: "4px",
      },
      borderWidth: {
        hairline: "1px",
      },
      transitionTimingFunction: {
        luxe: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      transitionDuration: {
        ui: "240ms",
        reveal: "800ms",
      },
      boxShadow: {
        focus: "0 0 0 2px #0A0A0B, 0 0 0 4px #C6A664",
      },
      opacity: {
        grain: "0.035",
      },
      backgroundImage: {
        "grain": "url('/grain.svg')",
      },
    },
  },
  plugins: [],
};

export default config;
