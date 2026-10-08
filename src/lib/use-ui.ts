import { useMemo } from "react";
import { useLocation } from "react-router";
import { languageFromPath, type Language } from "./i18n";
import { translator, type Translate } from "./ui";

/** Idioma de la página actual y sus textos de interfaz. El idioma sale de la ruta (`/en/`). */
export function useUi(): { language: Language; t: Translate } {
  const { pathname } = useLocation();
  const language = languageFromPath(pathname);
  const t = useMemo(() => translator(language), [language]);
  return { language, t };
}
