/** @type {import('tailwindcss').Config} */
import tailwindcssAnimate from "tailwindcss-animate";

export default {
  content: ["./dev.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          '"SF Pro Text"',
          '"SF Pro Display"',
          '"Helvetica Neue"',
          "Arial",
          "sans-serif",
        ],
        mono: [
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "monospace",
        ],
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
        label: {
          primary: "var(--label-primary)",
          secondary: "var(--label-secondary)",
          tertiary: "var(--label-tertiary)",
        },
        accent: {
          blue: "var(--accent-blue)",
        },
        system: {
          red: "var(--system-red)",
          green: "var(--system-green)",
          orange: "var(--system-orange)",
          purple: "var(--system-purple)",
          teal: "var(--system-teal)",
        },
      },
      boxShadow: {
        soft: "var(--shadow-soft)",
        input: "var(--shadow-input)",
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
        focus: "var(--shadow-focus)",
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
        pill: "var(--radius-pill)",
      },
      maxWidth: {
        page: "var(--max-page-width)",
      },
      transitionTimingFunction: {
        apple: "cubic-bezier(0.25, 0.1, 0.25, 1)",
      },
    },
  },
  plugins: [tailwindcssAnimate],
};
