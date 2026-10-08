import type { ReactNode } from "react";
import { Heading } from "../atoms/Heading";
import { TextLink } from "../atoms/TextLink";

// Estructura de la página de un caso (FR-035): volver, título, resumen, índice y cuerpo.
// No hay enlace de volver al final ni caso siguiente.
export function CaseTemplate({
  backHref,
  backLabel,
  eyebrow,
  title,
  summary,
  index,
  children,
}: {
  backHref: string;
  backLabel: string;
  eyebrow: string;
  title: string;
  summary: ReactNode;
  index: ReactNode;
  children?: ReactNode;
}) {
  return (
    <article className="py-8">
      <TextLink to={backHref} variant="standalone">
        <span aria-hidden="true">←&nbsp;</span>
        {backLabel}
      </TextLink>
      <p className="mt-4 text-text-muted">{eyebrow}</p>
      <Heading level={1} className="mt-1">
        {title}
      </Heading>
      {summary}
      {index}
      {children}
    </article>
  );
}
