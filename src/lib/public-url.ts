/** Prefija una ruta del sitio (`/casos/…`, `/cv.pdf`) con la base de GitHub Pages. */
export function publicUrl(path: string): string {
  if (!path.startsWith("/") || path.startsWith("//")) return path;
  const base = import.meta.env.BASE_URL ?? "/";
  const prefix = base.endsWith("/") ? base : `${base}/`;
  if (path === "/") return prefix;
  return `${prefix}${path.slice(1)}`;
}
