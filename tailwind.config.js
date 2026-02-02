/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: "hsl(var(--card))",
        border: "hsl(var(--border))",
        primary: "hsl(var(--primary))",
        "muted-foreground": "hsl(var(--muted-foreground))",
      },
      spacing: {
        header: "var(--header-height)",
        "bottom-nav": "var(--bottom-nav-height)",
        sidebar: "var(--sidebar-width)",
      },
    },
  },
  plugins: [],
};
