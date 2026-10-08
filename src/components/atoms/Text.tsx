import type { ReactNode } from "react";

const tones = { default: "", muted: "text-text-muted" } as const;
const sizes = { sm: "text-sm", base: "", lg: "text-lg" } as const;

type Props = {
  tone?: keyof typeof tones;
  size?: keyof typeof sizes;
  className?: string;
  children: ReactNode;
};

export function Text({ tone = "default", size = "base", className = "", children }: Props) {
  const classes = [tones[tone], sizes[size], className].filter(Boolean).join(" ");
  return <p className={classes || undefined}>{children}</p>;
}
