import matter from "gray-matter";
import { z } from "zod";
import type { Language } from "../lib/i18n";

export const PLACEHOLDER = "[COMPLETAR";

const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "solo minúsculas, números y guiones");
const text = z.string().trim().min(1);

const seoSchema = z.object({
  title: text.max(60),
  description: z.string().trim().min(50).max(160),
});

const productSummary = z.object({
  product: text,
  role: text,
  team: text,
  duration: text,
  keyResult: text,
  indexLine: text.max(120),
  productType: text,
  // Rubro del caso (p. ej. Fintech, ATS, Research, Design system): el chip de su tarjeta.
  sector: text,
});

const metaSummary = z.object({
  product: text,
  role: text,
  duration: text,
  keyResult: text,
  sector: text,
});

const caseBase = {
  slug,
  status: z.literal("published"),
  order: z.number().int().min(1),
  title: text.max(80),
  seo: seoSchema,
};

const publishedCaseSchema = z.discriminatedUnion("type", [
  z.object({ ...caseBase, type: z.literal("product"), summary: productSummary }),
  z.object({ ...caseBase, type: z.literal("meta"), summary: metaSummary }),
]);

const draftCaseSchema = z.looseObject({
  slug,
  type: z.enum(["product", "meta"]),
  status: z.literal("draft"),
  order: z.number().int().min(1),
});

const profileSchema = z.object({
  name: text,
  role: text,
  valueProposition: text.max(160),
  email: z.email(),
  linkedin: z.url(),
  cv: text,
});

const pageSchema = z.object({ seo: seoSchema });

export type CaseSummary = {
  product: string;
  role: string;
  team?: string;
  duration: string;
  keyResult: string;
  indexLine?: string;
  productType?: string;
  sector?: string;
};

export type CaseStudy = {
  slug: string;
  type: "product" | "meta";
  status: "draft" | "published";
  order: number;
  title: string;
  seo: { title: string; description: string };
  summary: CaseSummary;
  body: string;
};

export type Profile = z.infer<typeof profileSchema>;

export type PageId = "inicio" | "trabajos" | "sobre-mi" | "contacto";

export type ModulePage = {
  id: PageId;
  seo: { title: string; description: string };
  body: string;
};

export type Validation<T> = { data?: T; errors: string[] };

// Encabezados y etiquetas que exige cada idioma (FR-042): el contenido en inglés usa los suyos.
type Wording = {
  caseSections: string[];
  aboutSections: string[];
  keyDecisions: RegExp;
  keyDecisionsName: string;
  lessons: RegExp;
  lessonsName: string;
};

const wording: Record<Language, Wording> = {
  es: {
    caseSections: [
      "Problema inicial",
      "Investigación",
      "Arquitectura de la solución",
      "Resultados y aprendizajes",
    ],
    aboutSections: ["Forma de trabajar", "Métodos"],
    keyDecisions: /Decisi(?:ón|ones) clave/,
    keyDecisionsName: "**Decisiones clave:**",
    lessons: /Lo que (?:no funcionó|haría distinto)/,
    lessonsName: "**Lo que no funcionó:** o **Lo que haría distinto:**",
  },
  en: {
    caseSections: ["Initial problem", "Research", "Solution architecture", "Results and learnings"],
    aboutSections: ["Way of working", "Methods"],
    keyDecisions: /Key decisions?/,
    keyDecisionsName: "**Key decisions:**",
    lessons: /What (?:didn['’]t work|I would do differently)/,
    lessonsName: "**What didn't work:** or **What I would do differently:**",
  },
};

function zodErrors(error: z.ZodError): string[] {
  return error.issues.map((issue) => `${issue.path.join(".") || "frontmatter"}: ${issue.message}`);
}

function headings(body: string): string[] {
  return [...body.matchAll(/^##\s+(?:\d+\.\s*)?(.+?)\s*$/gm)].map((match) => match[1]);
}

function missingSectionsInOrder(body: string, required: string[]): string[] {
  const found = headings(body);
  let cursor = 0;
  const missing: string[] = [];
  for (const section of required) {
    const index = found.findIndex((heading, i) => i >= cursor && heading.startsWith(section));
    if (index === -1) missing.push(section);
    else cursor = index + 1;
  }
  return missing;
}

function hasFilledLabel(body: string, label: RegExp): boolean {
  return new RegExp(`\\*\\*${label.source}:\\*\\*\\s*\\S`).test(body);
}

function contentErrors(raw: string): string[] {
  const errors: string[] = [];
  if (raw.includes(PLACEHOLDER)) errors.push("contiene espacios [COMPLETAR] sin completar");
  if (/!\[\s*\]\(/.test(raw)) errors.push("hay una imagen sin texto alternativo");
  return errors;
}

export function validateCase(raw: string, language: Language = "es"): Validation<CaseStudy> {
  const words = wording[language];
  const { data, content } = matter(raw);

  if (data.status !== "published") {
    const draft = draftCaseSchema.safeParse(data);
    if (!draft.success) return { errors: zodErrors(draft.error) };
    return {
      data: {
        ...draft.data,
        title: String(data.title ?? draft.data.slug),
        seo: {
          title: String(data.seo?.title ?? ""),
          description: String(data.seo?.description ?? ""),
        },
        summary: (data.summary ?? {}) as CaseSummary,
        body: content,
      },
      errors: [],
    };
  }

  const parsed = publishedCaseSchema.safeParse(data);
  const errors = parsed.success ? [] : zodErrors(parsed.error);
  errors.push(...contentErrors(raw));

  for (const section of missingSectionsInOrder(content, words.caseSections)) {
    errors.push(`falta la sección "${section}" o no está en orden`);
  }
  if (!hasFilledLabel(content, words.keyDecisions)) {
    errors.push(`falta ${words.keyDecisionsName} con al menos una decisión`);
  }
  if (!hasFilledLabel(content, words.lessons)) {
    errors.push(`falta ${words.lessonsName}`);
  }

  if (!parsed.success || errors.length > 0) return { errors };
  return { data: { ...parsed.data, body: content }, errors: [] };
}

export function validateProfile(raw: string, { strict }: { strict: boolean }): Validation<Profile> {
  const { data } = matter(raw);
  if (!strict) return { data: data as Profile, errors: [] };

  const parsed = profileSchema.safeParse(data);
  const errors = parsed.success ? [] : zodErrors(parsed.error);
  errors.push(...contentErrors(raw));
  return errors.length > 0 ? { errors } : { data: parsed.data, errors };
}

export function validatePage(
  raw: string,
  id: PageId,
  { strict, language = "es" }: { strict: boolean; language?: Language },
): Validation<ModulePage> {
  const { data, content } = matter(raw);
  const page = { id, seo: data.seo ?? { title: "", description: "" }, body: content };
  if (!strict) return { data: page, errors: [] };

  const parsed = pageSchema.safeParse(data);
  const errors = parsed.success ? [] : zodErrors(parsed.error);
  errors.push(...contentErrors(raw));
  if (id === "sobre-mi") {
    for (const section of missingSectionsInOrder(content, wording[language].aboutSections)) {
      errors.push(`falta la sección "${section}"`);
    }
  }
  return errors.length > 0 ? { errors } : { data: page, errors };
}

// --- Paridad entre idiomas (FR-042) ---

/** Los archivos del mismo nombre deben existir en español y en inglés. */
export function fileParityErrors(kind: string, es: string[], en: string[]): string[] {
  return [
    ...es
      .filter((name) => !en.includes(name))
      .map((name) => `${kind}/${name} no tiene su par en en/`),
    ...en
      .filter((name) => !es.includes(name))
      .map((name) => `${kind}/${name} no tiene su par en es/`),
  ];
}

/** Cada caso y su par tienen el mismo tipo, estado y orden; uno publicado exige el par publicado. */
export function caseParityErrors(
  es: Record<string, CaseStudy>,
  en: Record<string, CaseStudy>,
): string[] {
  const errors = fileParityErrors("cases", Object.keys(es), Object.keys(en));
  for (const [name, spanish] of Object.entries(es)) {
    const english = en[name];
    if (!english) continue;
    for (const field of ["type", "status", "order"] as const) {
      if (spanish[field] !== english[field]) {
        errors.push(
          `cases/${name}: ${field} distinto (es: ${spanish[field]}, en: ${english[field]})`,
        );
      }
    }
  }
  return errors;
}

/** Los textos de interfaz tienen las mismas claves en los dos idiomas y ninguno está vacío. */
export function uiParityErrors(es: Record<string, string>, en: Record<string, string>): string[] {
  const errors: string[] = [];
  for (const key of Object.keys(es)) {
    if (!(key in en)) errors.push(`ui/en.json: falta la clave "${key}"`);
  }
  for (const key of Object.keys(en)) {
    if (!(key in es)) errors.push(`ui/es.json: falta la clave "${key}"`);
  }
  for (const [language, texts] of [
    ["es", es],
    ["en", en],
  ] as const) {
    for (const [key, value] of Object.entries(texts)) {
      if (value.trim() === "") errors.push(`ui/${language}.json: la clave "${key}" está vacía`);
    }
  }
  return errors;
}
