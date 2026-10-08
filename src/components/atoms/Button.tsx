import type { MouseEventHandler, ReactNode } from "react";
import { Link } from "react-router";

// Mismo tamaño y borde en las dos variantes para que midan lo mismo (FR-033).
const base =
  "inline-flex min-h-target min-w-target items-center justify-center border-control px-4 font-semibold transition-colors duration-state";

const variants = {
  primary:
    "border-primary bg-primary text-on-primary hover:border-primary-hover hover:bg-primary-hover active:border-primary-active active:bg-primary-active",
  secondary:
    "border-primary bg-transparent text-primary hover:border-primary-hover hover:text-primary-hover active:border-primary-active active:text-primary-active",
} as const;

type Common = { variant: keyof typeof variants; children: ReactNode };

type Props =
  | (Common & { to: string; href?: never; onClick?: never })
  | (Common & { href: string; to?: never; onClick?: never })
  | (Common & { onClick: MouseEventHandler<HTMLButtonElement>; to?: never; href?: never });

export function Button(props: Props) {
  const classes = `${base} ${variants[props.variant]}`;

  if (props.to !== undefined) {
    return (
      <Link to={props.to} className={classes}>
        {props.children}
      </Link>
    );
  }
  if (props.href !== undefined) {
    return (
      <a href={props.href} className={classes}>
        {props.children}
      </a>
    );
  }
  return (
    <button type="button" onClick={props.onClick} className={classes}>
      {props.children}
    </button>
  );
}
