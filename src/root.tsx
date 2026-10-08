import "@fontsource/inter/latin-400.css";
import "@fontsource/inter/latin-600.css";
import "@fontsource/manrope/latin-600.css";
import "@fontsource/manrope/latin-700.css";
import "./styles/main.scss";

import interRegular from "@fontsource/inter/files/inter-latin-400-normal.woff2?url";
import type { ReactNode } from "react";
import { Links, Meta, Outlet, Scripts, ScrollRestoration, useLocation } from "react-router";
import { languageFromPath } from "./lib/i18n";
import { themeInitScript } from "./lib/theme";
import type { Route } from "./+types/root";

export const links: Route.LinksFunction = () => [
  { rel: "preload", href: interRegular, as: "font", type: "font/woff2", crossOrigin: "anonymous" },
];

export function Layout({ children }: { children: ReactNode }) {
  // El idioma de cada documento sale de su ruta: `/en/…` es inglés y el resto, español (FR-041).
  const { pathname } = useLocation();

  return (
    // `data-theme` lo pone el script de abajo antes de pintar: React no lo conoce.
    <html lang={languageFromPath(pathname)} suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* Aplica el tema elegido antes de pintar para que no haya destello (FR-038). */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
