// Las secciones de un caso salen de los encabezados `##` de su Markdown, en cualquier idioma.
// El mismo cálculo alimenta los `id` de CaseBody y los enlaces del índice, así nunca se desfasan.

export type CaseSection = { id: string; title: string; number: number };

export function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Quita un prefijo numérico como «1.» del texto de un encabezado. */
export function headingTitle(text: string): string {
  return text.replace(/^\d+\.\s*/, "").trim();
}

export function extractSections(markdown: string): CaseSection[] {
  const titles = [...markdown.matchAll(/^##\s+(.+?)\s*$/gm)].map((match) => headingTitle(match[1]));
  return titles.map((title, index) => ({ id: slugify(title), title, number: index + 1 }));
}

/** Divide el cuerpo en el texto previo al primer `##` y un bloque por sección. */
export function splitBySection(markdown: string): { intro: string; sections: string[] } {
  const parts = markdown.split(/^(?=##\s)/m);
  const hasIntro = parts.length > 0 && !/^##\s/.test(parts[0]);
  return { intro: hasIntro ? parts[0] : "", sections: hasIntro ? parts.slice(1) : parts };
}
