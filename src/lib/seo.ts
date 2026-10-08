import type { MetaDescriptor } from "react-router";
import type { AlternateLink } from "./i18n";

type Env = { SITE_URL?: string; BASE_PATH?: string };

// Vite expone import.meta.env en la app; el script de sitemap corre en Node y usa process.env.
const env: Env = (import.meta as { env?: Env }).env ?? process.env;

const siteUrl = (env.SITE_URL ?? "http://localhost:5173").replace(/\/$/, "");
const basePath = (env.BASE_PATH ?? "/").replace(/\/$/, "");

export function canonicalUrl(path: string): string {
  const normalized = path === "/" ? "/" : `/${path.replace(/^\/|\/$/g, "")}/`;
  return `${siteUrl}${basePath}${normalized}`;
}

export function pageMeta({
  title,
  description,
  path,
  alternates = [],
}: {
  title: string;
  description: string;
  path: string;
  /** Versiones de la página en cada idioma, para `<link rel="alternate" hreflang>`. */
  alternates?: AlternateLink[];
}): MetaDescriptor[] {
  return [
    { title },
    { name: "description", content: description },
    { tagName: "link", rel: "canonical", href: canonicalUrl(path) },
    ...alternates.map(({ hreflang, path: alternatePath }) => ({
      tagName: "link" as const,
      rel: "alternate",
      hrefLang: hreflang,
      href: canonicalUrl(alternatePath),
    })),
  ];
}
