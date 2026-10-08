import { index, route, type RouteConfig } from "@react-router/dev/routes";
import { publishedCases } from "./content/load.server";

// Con ssr:false, una ruta con loader debe prerenderizar al menos una URL:
// las rutas de caso solo existen si hay casos publicados de ese tipo.
const casos: RouteConfig = [
  ...(publishedCases("meta").length > 0
    ? [route("trabajos/este-portafolio", "routes/caso-meta.tsx")]
    : []),
  ...(publishedCases("product").length > 0 ? [route("trabajos/:slug", "routes/caso.tsx")] : []),
];

// Prototipos de aprobación (Constitución, principio V): nunca entran en el build de producción.
const prototipos: RouteConfig = [route("prototipos/casos", "routes/prototipos/casos.tsx")];

export default [
  index("routes/inicio.tsx"),
  route("trabajos", "routes/trabajos.tsx"),
  ...casos,
  route("sobre-mi", "routes/sobre-mi.tsx"),
  route("contacto", "routes/contacto.tsx"),
  ...(process.env.NODE_ENV === "production" ? [] : prototipos),
  route("*", "routes/no-encontrada.tsx"),
] satisfies RouteConfig;
