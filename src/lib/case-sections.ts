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

/** Número de sección a dos dígitos, el mismo en las pestañas y en el cuerpo. */
export function padSection(number: number): string {
  return String(number).padStart(2, "0");
}

/**
 * Texto corto de la pestaña. El encabezado del cuerpo conserva el título completo
 * que exige el esquema.
 */
export function tabLabel(title: string): string {
  const key = slugify(title);
  if (key.startsWith("investigacion")) return "Investigación";
  if (key.startsWith("research")) return "Research";
  if (key.startsWith("arquitectura-de-la-solucion")) return "Solución";
  if (key.startsWith("solution-architecture")) return "Solution";
  if (key.startsWith("resultados")) return "Resultados";
  if (key.startsWith("results")) return "Results";
  if (key.startsWith("apoyo-visual")) return "Apoyo visual";
  if (key.startsWith("visual-support")) return "Visual support";
  return title;
}

export function extractSections(markdown: string): CaseSection[] {
  const titles = [...markdown.matchAll(/^##\s+(.+?)\s*$/gm)].map((match) => headingTitle(match[1]));
  return titles.map((title, index) => ({ id: slugify(title), title, number: index + 1 }));
}

/** Primera imagen Markdown del cuerpo: la tarjeta del índice y el apoyo visual usan la misma. */
export function firstMarkdownImage(markdown: string): { src: string; alt: string } | undefined {
  const match = markdown.match(/!\[([^\]]+)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)/);
  if (!match) return undefined;
  return { src: match[2], alt: match[1] };
}

/** Divide el cuerpo en el texto previo al primer `##` y un bloque por sección. */
export function splitBySection(markdown: string): { intro: string; sections: string[] } {
  const parts = markdown.split(/^(?=##\s)/m);
  const hasIntro = parts.length > 0 && !/^##\s/.test(parts[0]);
  return { intro: hasIntro ? parts[0] : "", sections: hasIntro ? parts.slice(1) : parts };
}
