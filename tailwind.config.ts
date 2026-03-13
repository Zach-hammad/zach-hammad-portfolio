import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#0a0a0a",
        card: "#111111",
        border: "#222222",
        "text-primary": "#fafafa",
        "text-secondary": "#999999",
        "text-muted": "#666666",
        "accent-hardware": "#4ade80",
        "accent-systems": "#60a5fa",
        "accent-software": "#c084fc",
      },
    },
  },
  plugins: [],
};

export default config;
