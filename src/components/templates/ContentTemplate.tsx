import type { ReactNode } from "react";
import type { SectionId } from "~/lib/sections";
import { Heading } from "../atoms/Heading";

type Section = { id: Exclude<SectionId, "inicio">; title: string; children: ReactNode };

// Secciones de `/` y `/en/` (contracts/routes.md): Inicio lleva el h1 dentro de la intro, con id
// `titulo-inicio`; las demás, un h2 con id `titulo-<id>` que les da nombre.
export function ContentTemplate({ intro, sections }: { intro: ReactNode; sections: Section[] }) {
  return (
    <>
      <section id="inicio" aria-labelledby="titulo-inicio">
        {intro}
      </section>
      {sections.map((section) => (
        <section
          key={section.id}
          id={section.id}
          aria-labelledby={`titulo-${section.id}`}
          className="border-t border-border py-12"
        >
          <Heading level={2} id={`titulo-${section.id}`}>
            {section.title}
          </Heading>
          {section.children}
        </section>
      ))}
    </>
  );
}
