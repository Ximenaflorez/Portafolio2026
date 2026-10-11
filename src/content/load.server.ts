import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
// Importes relativos: `react-router.config.ts` carga este archivo antes de que exista el alias `~`.
import {
  casePath,
  languages,
  legacyRedirects,
  metaCasePath,
  metaSlugs,
  staticPaths,
  type CasePair,
  type Language,
} from "../lib/i18n";
import { uiTexts } from "../lib/ui";
import {
  caseParityErrors,
  fileParityErrors,
  uiParityErrors,
  validateCase,
  validatePage,
  careerParityErrors,
  validateProfile,
  type CaseStudy,
  type ModulePage,
  type PageId,
  type Profile,
} from "./schema";

function contentDir(): string {
  return path.resolve(process.cwd(), process.env.CONTENT_DIR ?? "src/content");
}

function languageDir(language: Language): string {
  return path.join(contentDir(), language);
}

function requireComplete(): boolean {
  return process.env.REQUIRE_COMPLETE_CONTENT === "true";
}

function fail(file: string, errors: string[]): never {
  throw new Error(`Contenido inválido en ${file}:\n- ${errors.join("\n- ")}`);
}

function markdownFiles(dir: string): string[] {
  return existsSync(dir) ? readdirSync(dir).filter((file) => file.endsWith(".md")) : [];
}

/** Casos de un idioma por nombre de archivo, que es lo que empareja los dos idiomas. */
function loadCaseFiles(language: Language): Record<string, CaseStudy> {
  const dir = path.join(languageDir(language), "cases");
  const files: Record<string, CaseStudy> = {};
  for (const file of markdownFiles(dir)) {
    const result = validateCase(readFileSync(path.join(dir, file), "utf8"), language);
    if (!result.data) fail(`${language}/cases/${file}`, result.errors);
    files[file] = result.data;
  }
  return files;
}

export function loadCases(language: Language): CaseStudy[] {
  const cases = Object.values(loadCaseFiles(language));

  const slugs = cases.map((item) => item.slug);
  const duplicated = slugs.filter((item, index) => slugs.indexOf(item) !== index);
  if (duplicated.length > 0)
    fail(`${language}/cases/`, [`slug repetido: ${duplicated.join(", ")}`]);

  if (requireComplete()) {
    const published = cases.filter((item) => item.status === "published");
    const products = published.filter((item) => item.type === "product").length;
    const metas = published.filter((item) => item.type === "meta").length;
    if (products !== 3 || metas !== 1) {
      fail(`${language}/cases/`, [
        `se necesitan 3 casos de producto y 1 caso meta publicados; hay ${products} y ${metas}`,
      ]);
    }
  }

  return cases;
}

export function publishedCases(language: Language, type: CaseStudy["type"]): CaseStudy[] {
  return loadCases(language)
    .filter((item) => item.status === "published" && item.type === type)
    .sort((a, b) => a.order - b.order);
}

export function findPublishedCase(language: Language, slug: string): CaseStudy | undefined {
  return loadCases(language).find((item) => item.status === "published" && item.slug === slug);
}

export function loadProfile(language: Language): Profile {
  const file = path.join(languageDir(language), "profile.md");
  const result = validateProfile(readFileSync(file, "utf8"), { strict: requireComplete() });
  if (!result.data) fail(`${language}/profile.md`, result.errors);
  return result.data;
}

export function loadPage(language: Language, id: PageId): ModulePage {
  const file = path.join(languageDir(language), "pages", `${id}.md`);
  const result = validatePage(readFileSync(file, "utf8"), id, {
    strict: requireComplete(),
    language,
  });
  if (!result.data) fail(`${language}/pages/${id}.md`, result.errors);
  return result.data;
}

export function cvAvailable(cv: string): boolean {
  if (/^https?:\/\//.test(cv)) return true;
  return existsSync(path.resolve(process.cwd(), "public", cv.replace(/^\//, "")));
}

/** Falla el build si los dos idiomas no tienen el mismo contenido (FR-042). */
export function assertContentParity(): void {
  const [es, en] = [loadCaseFiles("es"), loadCaseFiles("en")];
  const errors = [
    ...caseParityErrors(es, en),
    ...fileParityErrors(
      "pages",
      markdownFiles(path.join(languageDir("es"), "pages")),
      markdownFiles(path.join(languageDir("en"), "pages")),
    ),
    ...fileParityErrors(
      "profile",
      existsSync(path.join(languageDir("es"), "profile.md")) ? ["profile.md"] : [],
      existsSync(path.join(languageDir("en"), "profile.md")) ? ["profile.md"] : [],
    ),
    ...uiParityErrors(uiTexts.es, uiTexts.en),
    ...careerParityErrors(loadProfile("es").career, loadProfile("en").career),
  ];
  if (errors.length > 0) fail("es/ y en/", errors);
}

/** Casos publicados con su dirección en cada idioma, para el selector de idioma y `hreflang`. */
export function casePairs(): CasePair[] {
  const [es, en] = [loadCaseFiles("es"), loadCaseFiles("en")];
  return Object.entries(es)
    .filter(([file, item]) => item.status === "published" && en[file]?.status === "published")
    .map(([file, item]) => ({
      file,
      type: item.type,
      slugs: item.type === "meta" ? metaSlugs : { es: item.slug, en: en[file].slug },
    }));
}

/** Páginas que se publican, con su dirección canónica (sin las redirecciones). */
export function publicPages(): string[] {
  const pages: string[] = languages.flatMap((language) => [
    ...staticPaths(language),
    ...publishedCases(language, "product").map((item) => casePath(language, item.slug)),
    ...publishedCases(language, "meta").map(() => metaCasePath(language)),
  ]);
  return pages;
}

/** Todo lo que se prerenderiza: las páginas y las redirecciones heredadas, sin barra final. */
export function publicPaths(): string[] {
  assertContentParity();
  const redirects = Object.keys(legacyRedirects);
  return [...publicPages(), ...redirects].map((item) =>
    item === "/" ? item : item.replace(/\/$/, ""),
  );
}
