import { splitBySection } from "./case-sections";

function sectionBody(block: string): string {
  return block.replace(/^##\s+.+\n+/, "").trim();
}

/** Cuerpo de Forma de trabajar y de Métodos, en ese orden (FR-025). */
export function splitAbout(markdown: string): { working: string; methods: string } {
  const bodies = splitBySection(markdown).sections.map(sectionBody);
  return { working: bodies[0] ?? "", methods: bodies[1] ?? "" };
}

/** Ítems de una lista Markdown; si el bloque es un párrafo, la lista queda vacía. */
export function methodItems(markdown: string): string[] {
  return markdown
    .split("\n")
    .map((line) => line.match(/^[-*]\s+(.+)/)?.[1]?.trim())
    .filter((item): item is string => Boolean(item));
}
