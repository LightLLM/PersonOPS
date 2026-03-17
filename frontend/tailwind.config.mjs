import { fontFamily } from "tailwindcss/defaultTheme";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#020817",
        foreground: "#E5E7EB",
        border: "#1F2937",
        muted: "#111827",
        accent: "#0EA5E9",
        accentMuted: "#0369A1",
        card: "#020617"
      },
      fontFamily: {
        sans: ["Inter", ...fontFamily.sans]
      }
    }
  },
  plugins: [import("tailwindcss-animate")]
};

