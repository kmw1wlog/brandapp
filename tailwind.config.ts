import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        forest: "#173f35",
        moss: "#2f6b4f",
        cream: "#f7f1e7",
        clay: "#d97938",
        ink: "#1d2320"
      },
      boxShadow: {
        soft: "0 20px 60px rgba(23, 63, 53, 0.12)"
      }
    }
  },
  plugins: []
};

export default config;
