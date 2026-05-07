import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        navy: "#062A5B",
        "navy-deep": "#021B3F",
        turquoise: "#00AEB8",
        "turquoise-light": "#12C7CE",
        muted: "#5F6368",
        "soft-bg": "#F5F7FA",
        line: "#E5EAF0",
        stock: "#2EAD4B",
        alert: "#E53935"
      },
      fontFamily: {
        sans: ["Inter", "Montserrat", "Poppins", "Arial", "sans-serif"]
      },
      boxShadow: {
        soft: "0 12px 34px rgba(2, 27, 63, 0.09)"
      }
    }
  },
  plugins: []
};

export default config;
