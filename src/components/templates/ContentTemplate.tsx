import type { ReactNode } from "react";
import type { SectionId } from "~/lib/sections";
import { Heading } from "../atoms/Heading";
import { Text } from "../atoms/Text";

type Section = {
  id: Exclude<SectionId, "inicio">;
  title: string;
  eyebrow?: string;
  titleSize?: "lg" | "xl" | "2xl" | "3xl" | "4xl";
  /** El h2 vive dentro de `children` (p. ej. la columna izquierda de Sobre mí). */
  hideTitle?: boolean;
  children: ReactNode;
};

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
          {section.hideTitle ? null : (
            <>
              {section.eyebrow ? (
                <Text tone="muted" size="sm">
                  {section.eyebrow}
                </Text>
              ) : null}
              <Heading
                level={2}
                size={section.titleSize}
                id={`titulo-${section.id}`}
                className={section.eyebrow ? "mt-2" : undefined}
              >
                {section.title}
              </Heading>
            </>
          )}
          {section.children}
        </section>
      ))}
    </>
  );
}
