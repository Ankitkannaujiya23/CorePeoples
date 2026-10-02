/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#0E0F12",
          900: "#15171C",
          800: "#1E2129",
          700: "#2A2E38",
          600: "#3C4150",
          500: "#565C6D",
        },
        surface: {
          50: "#FAFAF9",
          100: "#F3F3F1",
          200: "#E8E7E3",
        },
        line: {
          100: "#ECEBE7",
          200: "#DFDDD7",
        },
        bronze: {
          50: "#FBF6EC",
          100: "#F3E6C8",
          300: "#D9B876",
          500: "#B08D3F",
          600: "#8F7132",
          700: "#6E5726",
        },
        success: { 50: "#EEF7EE", 500: "#2E7D46", 600: "#256838" },
        warning: { 50: "#FDF6EC", 500: "#B4770F", 600: "#8F5F0C" },
        danger: { 50: "#FCEEEE", 500: "#B33A3A", 600: "#932E2E" },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "monospace"],
      },
      boxShadow: {
        subtle: "0 1px 2px rgba(14,15,18,0.04), 0 1px 1px rgba(14,15,18,0.03)",
        card: "0 1px 3px rgba(14,15,18,0.06), 0 4px 12px -4px rgba(14,15,18,0.06)",
        pop: "0 8px 24px -6px rgba(14,15,18,0.14)",
      },
      borderRadius: {
        xl2: "1.125rem",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: 0, transform: "translateY(4px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        "scale-in": {
          "0%": { opacity: 0, transform: "scale(0.97)" },
          "100%": { opacity: 1, transform: "scale(1)" },
        },
        "grow-bar": {
          "0%": { width: "0%" },
        },
        "stamp": {
          "0%": { opacity: 0, transform: "scale(0.6) rotate(-8deg)" },
          "60%": { opacity: 1, transform: "scale(1.08) rotate(2deg)" },
          "100%": { opacity: 1, transform: "scale(1) rotate(0deg)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.35s ease-out both",
        "scale-in": "scale-in 0.2s ease-out both",
        "stamp": "stamp 0.5s cubic-bezier(.2,.8,.2,1) both",
      },
    },
  },
  plugins: [],
};
