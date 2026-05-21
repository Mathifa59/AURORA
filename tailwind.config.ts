import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background:        "hsl(var(--background))",
        foreground:        "hsl(var(--foreground))",
        card:              "hsl(var(--card))",
        "card-foreground": "hsl(var(--card-foreground))",
        muted:             "hsl(var(--muted))",
        "muted-foreground":"hsl(var(--muted-foreground))",
        border:            "hsl(var(--border))",
        input:             "hsl(var(--input))",
        ring:              "hsl(var(--ring))",
        primary: {
          DEFAULT:    "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        accent: {
          DEFAULT:    "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT:    "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0", transform: "translateY(4px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        "slide-up": {
          from: { opacity: "0", transform: "translateY(12px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in-right": {
          from: { opacity: "0", transform: "translateX(16px)" },
          to:   { opacity: "1", transform: "translateX(0)" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.97) translateY(4px)" },
          to:   { opacity: "1", transform: "scale(1) translateY(0)" },
        },
        shimmer: {
          "0%":   { backgroundPosition: "-400px 0" },
          "100%": { backgroundPosition:  "400px 0" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%":      { opacity: "0.6" },
        },
        "ping-soft": {
          "0%, 100%": { boxShadow: "0 0 0 0 hsl(var(--primary) / 0.3)" },
          "50%":      { boxShadow: "0 0 0 6px hsl(var(--primary) / 0)" },
        },
      },
      animation: {
        "fade-in":        "fade-in 0.3s ease-out",
        "slide-up":       "slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-in-right": "slide-in-right 0.28s cubic-bezier(0.16, 1, 0.3, 1)",
        "scale-in":       "scale-in 0.22s cubic-bezier(0.16, 1, 0.3, 1)",
        shimmer:          "shimmer 1.4s ease-in-out infinite",
        "pulse-soft":     "pulse-soft 2s ease-in-out infinite",
        "ping-soft":      "ping-soft 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
