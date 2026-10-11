import { index, prefix, route, type RouteConfig } from "@react-router/dev/routes";
import { publishedCases } from "./content/load.server";

// Con ssr:false, una ruta con loader debe prerenderizar al menos una URL:
// las rutas de caso solo existen si hay casos publicados de ese tipo.
const casos: RouteConfig = [
  ...(publishedCases("es", "meta").length > 0
    ? [route("trabajos/este-portafolio", "routes/caso-meta.tsx")]
    : []),
  ...(publishedCases("es", "product").length > 0
    ? [route("trabajos/:slug", "routes/caso.tsx")]
    : []),
];

// Inglés: vive bajo `/en/`, con `work` en lugar de `trabajos` (contracts/routes.md).
// Las páginas de sección separadas solo existen en español, como redirecciones.
const englishCases: RouteConfig = [
  ...(publishedCases("en", "meta").length > 0
    ? [route("work/this-portfolio", "routes/en/caso-meta.tsx")]
    : []),
  ...(publishedCases("en", "product").length > 0
    ? [route("work/:slug", "routes/en/caso.tsx")]
    : []),
];
const english: RouteConfig = prefix("en", [index("routes/en/inicio.tsx"), ...englishCases]);

export default [
  index("routes/inicio.tsx"),
  route("trabajos", "routes/trabajos.tsx"),
  ...casos,
  route("sobre-mi", "routes/sobre-mi.tsx"),
  route("contacto", "routes/contacto.tsx"),
  ...english,
  route("*", "routes/no-encontrada.tsx"),
] satisfies RouteConfig;
