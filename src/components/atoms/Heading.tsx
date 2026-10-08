import type { ReactNode } from "react";

// El nivel es semántico (h1 a h4); el tamaño sale de la escala y puede ser distinto del nivel.
const sizes = {
  lg: "text-lg",
  xl: "text-xl",
  "2xl": "text-2xl",
  "3xl": "text-3xl",
  "4xl": "text-4xl",
} as const;

const defaultSize = { 1: "3xl", 2: "2xl", 3: "xl", 4: "lg" } as const;

type Level = 1 | 2 | 3 | 4;

type Props = {
  level: Level;
  size?: keyof typeof sizes;
  id?: string;
  className?: string;
  children: ReactNode;
};

export function Heading({ level, size, id, className = "", children }: Props) {
  const Tag = `h${level}` as const;
  const classes = `${sizes[size ?? defaultSize[level]]} ${className}`.trim();
  return (
    <Tag id={id} className={classes}>
      {children}
    </Tag>
  );
}
