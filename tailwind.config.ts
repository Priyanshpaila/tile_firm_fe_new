import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        skin: {
          bg: "var(--background)",
          bgAlt: "var(--background-alt)",
          surface: "var(--surface)",
          surfaceAlt: "var(--surface-alt)",
          text: "var(--text-primary)",
          textMuted: "var(--text-secondary)",
          accent: "var(--accent-primary)",
          accentSoft: "var(--accent-secondary)",
          border: "var(--border-soft)"
        }
      }
    }
  },
  plugins: []
};

export default config;
