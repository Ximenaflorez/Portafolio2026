import type { ReactNode } from "react";
import { Heading } from "../atoms/Heading";
import { TextLink } from "../atoms/TextLink";

// Página de un caso: volver antes del título, luego el resumen y el cuerpo.
export function CaseTemplate({
  backHref,
  backLabel,
  eyebrow,
  title,
  summary,
  children,
}: {
  backHref: string;
  backLabel: string;
  eyebrow: string;
  title: string;
  summary: ReactNode;
  children?: ReactNode;
}) {
  return (
    <article className="pb-8">
      <TextLink to={backHref} variant="standalone" className="font-semibold">
        <span aria-hidden="true">←&nbsp;</span>
        {backLabel}
      </TextLink>
      <p className="mt-6 text-primary">{eyebrow}</p>
      <Heading level={1} size="4xl" className="mt-2">
        {title}
      </Heading>
      {summary}
      {children}
    </article>
  );
}
