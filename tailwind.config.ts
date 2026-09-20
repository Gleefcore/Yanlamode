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
        luxe: {
          // 50% Blanc cassé tendant vers l'or doré
          ivory: {
            DEFAULT: "#FAF8F5",
            warm: "#F5F1EA",
            cream: "#F1EBE1",
            soft: "#F9F6F0",
          },
          // 40% Blanc net / pur
          white: "#FFFFFF",
          // 20% Noir profond de structure et typographie
          black: {
            DEFAULT: "#111111",
            dark: "#0A0A0A",
            soft: "#1A1A1A",
            muted: "#262626",
          },
          // 6% Or doré joaillerie
          gold: {
            DEFAULT: "#C5A880",
            light: "#E5C89C",
            bright: "#D4AF37",
            dark: "#9B7E58",
            subtle: "#DFC5A2",
          },
          border: {
            DEFAULT: "#E8E2D9",
            gold: "rgba(197, 168, 128, 0.4)",
            dark: "#262626",
          },
        },
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "Cormorant Garamond", "Didot", "Bodoni MT", "Georgia", "serif"],
        sans: ["var(--font-montserrat)", "Plus Jakarta Sans", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        widest: ".25em",
        ultra: ".35em",
      },
    },
  },
  plugins: [],
};

export default config;
