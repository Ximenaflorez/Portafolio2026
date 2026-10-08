import type { ReactNode } from "react";
import { Link } from "react-router";

// La sección actual no depende solo del color: lleva subrayado grueso y peso semibold.
export function NavLink({
  to,
  current = false,
  children,
}: {
  to: string;
  current?: boolean;
  children: ReactNode;
}) {
  const state = current
    ? "border-primary font-semibold text-primary"
    : "border-transparent text-text";

  return (
    <Link
      to={to}
      aria-current={current ? "location" : undefined}
      className={`inline-flex min-h-target min-w-target items-center border-b-indicator transition-colors duration-state hover:text-primary-hover active:text-primary-active ${state}`}
    >
      {children}
    </Link>
  );
}
