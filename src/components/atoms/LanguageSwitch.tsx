import { Link } from "react-router";
import type { Language } from "~/lib/i18n";

// Enlace a la misma página en el otro idioma. Muestra el código («EN» o «ES») y el nombre
// completo queda solo para lectores de pantalla, de modo que el nombre accesible empieza por
// lo que se ve (WCAG 2.5.3). Funciona sin JavaScript: es un enlace.
export function LanguageSwitch({
  to,
  code,
  name,
  language,
}: {
  to: string;
  code: string;
  name: string;
  language: Language;
}) {
  return (
    <Link
      to={to}
      hrefLang={language}
      lang={language}
      className="inline-flex min-h-target min-w-target items-center justify-center font-semibold text-text transition-colors duration-state hover:text-primary-hover active:text-primary-active"
    >
      {code} <span className="sr-only">{name}</span>
    </Link>
  );
}
