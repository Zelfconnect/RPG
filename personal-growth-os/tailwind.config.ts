import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#FF8B2C", // Flipper orange
          foreground: "#000000",
        },
        secondary: {
          DEFAULT: "#000000",
          foreground: "#FF8B2C",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "#2A2A2A",
          foreground: "#FF8B2C",
        },
        accent: {
          DEFAULT: "#FF8B2C",
          foreground: "#000000",
        },
        popover: {
          DEFAULT: "#000000",
          foreground: "#FF8B2C",
        },
        card: {
          DEFAULT: "#000000",
          foreground: "#FF8B2C",
        },
      },
      fontFamily: {
        mono: ["Share Tech Mono", "monospace"],
        pixel: ["Press Start 2P", "cursive"],
      },
      borderRadius: {
        lg: "0.5rem",
        md: "0.375rem",
        sm: "0.25rem",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config

