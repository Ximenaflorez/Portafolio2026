// Idiomas del sitio y sus rutas (contracts/routes.md, FR-039 a FR-041).
// Módulo puro: lo usan las rutas, el sitemap y los componentes, en el servidor y en el navegador.

export const languages = ["es", "en"] as const;
export type Language = (typeof languages)[number];
export const defaultLanguage: Language = "es";

/** El español no lleva prefijo; el inglés vive bajo `/en/`. */
const prefixes: Record<Language, string> = { es: "", en: "/en" };

/** Tramo de la ruta de un caso en cada idioma: `/trabajos/:slug/` y `/en/work/:slug/`. */
const caseSegments: Record<Language, string> = { es: "trabajos", en: "work" };

/** El caso meta tiene una dirección fija en cada idioma. */
export const metaSlugs: Record<Language, string> = {
  es: "este-portafolio",
  en: "this-portfolio",
};

/** Páginas de sección separadas de la versión anterior: solo existen en español, como redirección. */
export const legacyRedirects: Record<string, string> = {
  "/trabajos/": "/#trabajos",
  "/sobre-mi/": "/#sobre-mi",
  "/contacto/": "/#contacto",
};

/** Un caso de estudio y su dirección en cada idioma; se empareja por el nombre de archivo. */
export type CasePair = {
  file: string;
  type: "product" | "meta";
  slugs: Record<Language, string>;
};

export type AlternateLink = { hreflang: Language | "x-default"; path: string };

/** El otro idioma, al que lleva el selector. */
export function otherLanguage(language: Language): Language {
  return language === "es" ? "en" : "es";
}

export function homePath(language: Language): string {
  return language === "es" ? "/" : `${prefixes[language]}/`;
}

export function sectionPath(language: Language, sectionId: string): string {
  return `${homePath(language)}#${sectionId}`;
}

export function casePath(language: Language, slug: string): string {
  return `${prefixes[language]}/${caseSegments[language]}/${slug}/`;
}

export function metaCasePath(language: Language): string {
  return casePath(language, metaSlugs[language]);
}

/** Páginas que no dependen del contenido (las de caso salen de los casos publicados). */
export function staticPaths(language: Language): string[] {
  return [homePath(language)];
}

export function languageFromPath(pathname: string): Language {
  return pathname === "/en" || pathname.startsWith("/en/") ? "en" : "es";
}

function segmentsOf(pathname: string, language: Language): string[] {
  const rest = language === "en" ? pathname.slice("/en".length) : pathname;
  return rest.split("/").filter(Boolean);
}

/** Es la página principal de su idioma (`/` o `/en/`), la única con secciones. */
export function isHomePath(pathname: string): boolean {
  return segmentsOf(pathname, languageFromPath(pathname)).length === 0;
}

/** El caso al que pertenece una ruta, si es una ruta de caso. */
function pairOfPath(pathname: string, pairs: CasePair[]): CasePair | undefined {
  const language = languageFromPath(pathname);
  const segments = segmentsOf(pathname, language);
  if (segments.length !== 2 || segments[0] !== caseSegments[language]) return undefined;
  return pairs.find((pair) => pair.slugs[language] === segments[1]);
}

function casePathOf(pair: CasePair, language: Language): string {
  return pair.type === "meta" ? metaCasePath(language) : casePath(language, pair.slugs[language]);
}

/**
 * Página equivalente en otro idioma. Un caso lleva al mismo caso; la página principal conserva la
 * sección si se indica; cualquier otra ruta lleva a la principal del idioma de destino.
 */
export function equivalentPath(
  pathname: string,
  target: Language,
  pairs: CasePair[],
  sectionId?: string,
): string {
  const language = languageFromPath(pathname);
  const pair = pairOfPath(pathname, pairs);
  if (pair) return casePathOf(pair, target);

  const isHome = isHomePath(pathname);
  if (isHome && language === target) return pathname;
  return isHome && sectionId ? sectionPath(target, sectionId) : homePath(target);
}

/** Alternativas `hreflang` de una página: sus versiones en cada idioma y `x-default` (español). */
export function alternateLinks(pathname: string, pairs: CasePair[]): AlternateLink[] {
  const links: AlternateLink[] = languages.map((language) => ({
    hreflang: language,
    path: equivalentPath(pathname, language, pairs),
  }));
  return [
    ...links,
    { hreflang: "x-default", path: equivalentPath(pathname, defaultLanguage, pairs) },
  ];
}
