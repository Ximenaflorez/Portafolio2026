import type { AnchorHTMLAttributes, ReactNode } from "react";
import { Link } from "react-router";

// `inline`: dentro de un párrafo, exento del área de 44px (FR-027).
// `standalone`: enlace aislado, con área mínima de 44×44px.
const variants = {
  inline:
    "text-primary underline transition-colors duration-state hover:text-primary-hover active:text-primary-active",
  standalone:
    "inline-flex min-h-target min-w-target items-center text-text transition-colors duration-state hover:text-primary-hover active:text-primary-active",
} as const;

type Common = {
  variant?: keyof typeof variants;
  className?: string;
  children: ReactNode;
};

type Props =
  | (Common & { to: string; href?: never })
  | (Common & { href: string; to?: never } & Omit<
        AnchorHTMLAttributes<HTMLAnchorElement>,
        "href" | "className" | "children"
      >);

export function TextLink(props: Props) {
  const { variant = "inline", className = "", children } = props;
  const classes = `${variants[variant]} ${className}`.trim();

  if (props.to !== undefined) {
    return (
      <Link to={props.to} className={classes}>
        {children}
      </Link>
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { variant: _v, className: _c, children: _ch, to: _t, ...anchor } = props;
  return (
    <a {...anchor} className={classes}>
      {children}
    </a>
  );
}
