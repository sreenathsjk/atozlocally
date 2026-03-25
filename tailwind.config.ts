import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          900: "#080810",
          800: "#0e0e1a",
          700: "#14141f",
          600: "#1c1c2e",
          500: "#252538",
        },
        neon: {
          cyan: "#00f5ff",
          purple: "#bf5af2",
          pink: "#ff2d78",
          green: "#32d74b",
          orange: "#ff9f0a",
        },
      },
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
        mono: ["var(--font-mono)"],
      },
      animation: {
        "pulse-neon": "pulse-neon 2s ease-in-out infinite",
        "slide-up": "slide-up 0.4s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
        shimmer: "shimmer 2s linear infinite",
        float: "float 3s ease-in-out infinite",
      },
      keyframes: {
        "pulse-neon": {
          "0%, 100%": { boxShadow: "0 0 5px #00f5ff, 0 0 10px #00f5ff40" },
          "50%": { boxShadow: "0 0 20px #00f5ff, 0 0 40px #00f5ff40" },
        },
        "slide-up": {
          from: { transform: "translateY(20px)", opacity: "0" },
          to: { transform: "translateY(0)", opacity: "1" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
        },
      },
      backgroundImage: {
        "neon-gradient": "linear-gradient(135deg, #00f5ff20, #bf5af220)",
        "card-gradient": "linear-gradient(145deg, #14141f, #1c1c2e)",
        "shimmer-gradient":
          "linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent)",
      },
    },
  },
  plugins: [],
};
export default config;
