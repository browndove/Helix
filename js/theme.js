/**
 * Helix Health — shared Tailwind theme tokens.
 * Loaded immediately after the Tailwind CDN script on every page.
 */
tailwind.config = {
  theme: {
    extend: {
      colors: {
        brand: {
          charcoal: "oklch(14.89% 0.0027 248.08)",
          green: "#0A4676",
          greenlight: "#D7E5F0",
          blue: "oklch(83.46% 0.0735 257.42)",
          pink: "oklch(87.47% 0.114 327.97)",
          yellow: "oklch(92.75% 0.1157 97.52)",
          gold: "oklch(66.45% 0.1516 62.96)",
          teal: "oklch(47.69% 0.0847 225.96)",
          whitefr: "oklch(100% 0 0)",
          off: "oklch(98.21% 0 129.63)",
          grey: "oklch(88.22% 0 0)",
          pewter: "oklch(55.55% 0 0)",
          graphite: "oklch(33.1% 0.0104 253.98)",
          navy: "#0A4676",
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        brand: "0 4px 24px oklch(14.89% 0.0027 248.08 / 0.08)",
        "brand-lg": "0 16px 48px oklch(14.89% 0.0027 248.08 / 0.12)",
      },
    },
  },
};
