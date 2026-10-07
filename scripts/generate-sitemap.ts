import { copyFileSync, existsSync, writeFileSync } from "node:fs";
import path from "node:path";
import { publicPaths } from "../src/content/load.server";
import { canonicalUrl } from "../src/lib/seo";

const outDir = path.resolve("build/client");

const urls = publicPaths()
  .map((item) => `  <url><loc>${canonicalUrl(item)}</loc></url>`)
  .join("\n");

writeFileSync(
  path.join(outDir, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
);

writeFileSync(
  path.join(outDir, "robots.txt"),
  `User-agent: *\nAllow: /\n\nSitemap: ${canonicalUrl("/").replace(/\/$/, "")}/sitemap.xml\n`,
);

// GitHub Pages sirve 404.html para cualquier ruta inexistente.
const fallback = path.join(outDir, "__spa-fallback.html");
if (existsSync(fallback)) copyFileSync(fallback, path.join(outDir, "404.html"));
