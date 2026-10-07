import type { MetaDescriptor } from "react-router";

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
}: {
  title: string;
  description: string;
  path: string;
}): MetaDescriptor[] {
  return [
    { title },
    { name: "description", content: description },
    { tagName: "link", rel: "canonical", href: canonicalUrl(path) },
  ];
}
