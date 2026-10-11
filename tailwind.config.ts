import type { Config } from "tailwindcss";

const color = (name: string) => `rgb(var(--color-${name}) / <alpha-value>)`;

const spaceKeys = ["0", "0.5", "1", "2", "3", "4", "5", "6", "8", "10", "12", "16"];
const spacing = Object.fromEntries(
  spaceKeys.map((key) => [key, `var(--space-${key.replace(".", "-")})`]),
);

export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
    },
    colors: {
      transparent: "transparent",
      current: "currentColor",
      background: color("background"),
      surface: {
        DEFAULT: color("surface"),
        tonal: color("surface-tonal"),
      },
      "secondary-container": color("secondary-container"),
      text: {
        DEFAULT: color("text"),
        muted: color("text-muted"),
      },
      primary: {
        DEFAULT: color("primary"),
        hover: color("primary-hover"),
        active: color("primary-active"),
      },
      "on-primary": color("on-primary"),
      focus: color("focus"),
      error: color("error"),
      success: color("success"),
      border: {
        DEFAULT: color("border"),
        strong: color("border-strong"),
      },
    },
    fontFamily: {
      heading: "var(--font-heading)",
      body: "var(--font-body)",
    },
    fontSize: {
      sm: ["var(--text-step--1)", { lineHeight: "var(--leading-body)" }],
      base: ["var(--text-step-0)", { lineHeight: "var(--leading-body)" }],
      lg: ["var(--text-step-1)", { lineHeight: "var(--leading-body)" }],
      xl: ["var(--text-step-2)", { lineHeight: "var(--leading-heading)" }],
      "2xl": ["var(--text-step-3)", { lineHeight: "var(--leading-heading)" }],
      "3xl": ["var(--text-step-4)", { lineHeight: "var(--leading-heading)" }],
      "4xl": ["var(--text-step-5)", { lineHeight: "var(--leading-heading)" }],
    },
    fontWeight: {
      normal: "var(--weight-body)",
      semibold: "var(--weight-body-strong)",
      bold: "var(--weight-heading)",
    },
    lineHeight: {
      body: "var(--leading-body)",
      heading: "var(--leading-heading)",
    },
    spacing,
    transitionDuration: {
      DEFAULT: "var(--duration-state)",
      state: "var(--duration-state)",
    },
    extend: {
      minWidth: { target: "var(--target-min)" },
      minHeight: { target: "var(--target-min)" },
      maxWidth: { content: "var(--content-max)", prose: "var(--prose-max)" },
      borderWidth: {
        DEFAULT: "var(--border-width)",
        indicator: "var(--indicator-width)",
        control: "var(--control-border-width)",
        photo: "var(--photo-border-width)",
      },
      borderRadius: {
        photo: "var(--photo-radius)",
        chip: "var(--chip-radius)",
        card: "var(--card-radius)",
        button: "var(--button-radius)",
        inherit: "inherit",
      },
      opacity: { "state-hover": "var(--state-hover)", "state-press": "var(--state-press)" },
      content: { empty: '""' },
      inset: { "header-collapse": "var(--header-collapse)" },
      scrollPadding: { header: "var(--header-height)" },
    },
  },
  plugins: [],
} satisfies Config;
