import { copyFileSync, existsSync, writeFileSync } from "node:fs";
import path from "node:path";
import { casePairs, publicPages } from "../src/content/load.server";
import { alternateLinks } from "../src/lib/i18n";
import { canonicalUrl } from "../src/lib/seo";

const outDir = path.resolve("build/client");
const pairs = casePairs();

// Cada página lista su versión en cada idioma, y cada idioma aparece como una entrada (SC-007).
const urls = publicPages()
  .map((page) => {
    const alternates = alternateLinks(page, pairs)
      .map(
        ({ hreflang, path: alternate }) =>
          `    <xhtml:link rel="alternate" hreflang="${hreflang}" href="${canonicalUrl(alternate)}"/>`,
      )
      .join("\n");
    return `  <url>\n    <loc>${canonicalUrl(page)}</loc>\n${alternates}\n  </url>`;
  })
  .join("\n");

writeFileSync(
  path.join(outDir, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls}\n</urlset>\n`,
);

writeFileSync(
  path.join(outDir, "robots.txt"),
  `User-agent: *\nAllow: /\n\nSitemap: ${canonicalUrl("/").replace(/\/$/, "")}/sitemap.xml\n`,
);

// GitHub Pages sirve 404.html para cualquier ruta inexistente.
const fallback = path.join(outDir, "__spa-fallback.html");
if (existsSync(fallback)) copyFileSync(fallback, path.join(outDir, "404.html"));
