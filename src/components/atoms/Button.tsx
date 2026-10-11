import type { MouseEventHandler, ReactNode } from "react";
import { Link } from "react-router";

// Píldora con capa de estado (aprobado el 2026-10-09): el color no cambia con el puntero ni al
// presionar; se superpone una capa (`after:`) del color de la etiqueta al 8 % y al 16 %.
// Mismo tamaño y borde en las dos variantes para que midan lo mismo (FR-033). En teléfono ocupan
// todo el ancho; desde `sm` el de su contenido.
const base =
  "relative inline-flex w-full sm:w-auto min-h-target min-w-target items-center justify-center rounded-button border px-4 font-semibold transition-colors duration-state after:pointer-events-none after:absolute after:inset-0 after:rounded-inherit after:content-empty after:opacity-0 after:transition-opacity after:duration-state hover:after:opacity-state-hover active:after:opacity-state-press";

const variants = {
  primary: "border-primary bg-primary text-on-primary after:bg-on-primary",
  // El contorno en Primary da el 3:1 que el relleno tonal, tan cercano al fondo, no da solo.
  secondary: "border-primary bg-secondary-container text-primary after:bg-primary",
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
