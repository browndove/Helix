/** @type {import('tailwindcss').Config} */
export default {
  content: ["./dev.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Montserrat", "system-ui", "-apple-system", "sans-serif"],
      },
      colors: {
        primary: "var(--bg-primary)",
        "primary-light": "var(--bg-primary-light)",
        secondary: "var(--bg-secondary)",
        tertiary: "var(--bg-tertiary)",
        quaternary: "var(--bg-quaternary)",
        "text-primary": "var(--text-primary)",
        "text-secondary": "var(--text-secondary)",
        "text-tertiary": "var(--text-tertiary)",
        "accent-primary": "var(--accent-primary)",
        "accent-red": "var(--accent-red)",
        "accent-green": "var(--accent-green)",
        "accent-violet": "var(--accent-violet)",
        "accent-orange": "var(--accent-orange)",
      },
      boxShadow: {
        soft: "var(--shadow-soft)",
        input: "var(--shadow-input)",
      },
      maxWidth: {
        page: "var(--max-page-width)",
      },
    },
  },
  plugins: [],
};
