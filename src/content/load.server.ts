import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import {
  validateCase,
  validatePage,
  validateProfile,
  type CaseStudy,
  type ModulePage,
  type PageId,
  type Profile,
} from "./schema";

function contentDir(): string {
  return path.resolve(process.cwd(), process.env.CONTENT_DIR ?? "src/content");
}

function requireComplete(): boolean {
  return process.env.REQUIRE_COMPLETE_CONTENT === "true";
}

function fail(file: string, errors: string[]): never {
  throw new Error(`Contenido inválido en ${file}:\n- ${errors.join("\n- ")}`);
}

export function loadCases(): CaseStudy[] {
  const dir = path.join(contentDir(), "cases");
  const cases = readdirSync(dir)
    .filter((file) => file.endsWith(".md"))
    .map((file) => {
      const result = validateCase(readFileSync(path.join(dir, file), "utf8"));
      if (!result.data) fail(file, result.errors);
      return result.data;
    });

  const slugs = cases.map((item) => item.slug);
  const duplicated = slugs.filter((item, index) => slugs.indexOf(item) !== index);
  if (duplicated.length > 0) fail("cases/", [`slug repetido: ${duplicated.join(", ")}`]);

  if (requireComplete()) {
    const published = cases.filter((item) => item.status === "published");
    const products = published.filter((item) => item.type === "product").length;
    const metas = published.filter((item) => item.type === "meta").length;
    if (products !== 3 || metas !== 1) {
      fail("cases/", [
        `se necesitan 3 casos de producto y 1 caso meta publicados; hay ${products} y ${metas}`,
      ]);
    }
  }

  return cases;
}

export function publishedCases(type: CaseStudy["type"]): CaseStudy[] {
  return loadCases()
    .filter((item) => item.status === "published" && item.type === type)
    .sort((a, b) => a.order - b.order);
}

export function findPublishedCase(slug: string): CaseStudy | undefined {
  return loadCases().find((item) => item.status === "published" && item.slug === slug);
}

export function loadProfile(): Profile {
  const file = path.join(contentDir(), "profile.md");
  const result = validateProfile(readFileSync(file, "utf8"), { strict: requireComplete() });
  if (!result.data) fail("profile.md", result.errors);
  return result.data;
}

export function loadPage(id: PageId): ModulePage {
  const file = path.join(contentDir(), "pages", `${id}.md`);
  const result = validatePage(readFileSync(file, "utf8"), id, { strict: requireComplete() });
  if (!result.data) fail(`pages/${id}.md`, result.errors);
  return result.data;
}

export function cvAvailable(cv: string): boolean {
  if (/^https?:\/\//.test(cv)) return true;
  return existsSync(path.resolve(process.cwd(), "public", cv.replace(/^\//, "")));
}

export function publicPaths(): string[] {
  const cases = publishedCases("product").map((item) => `/trabajos/${item.slug}`);
  const meta = publishedCases("meta").map(() => "/trabajos/este-portafolio");
  return ["/", "/trabajos", ...cases, ...meta, "/sobre-mi", "/contacto"];
}
