import en from "../content/ui/en.json";
import es from "../content/ui/es.json";
import type { Language } from "./i18n";

// Textos de interfaz de los dos idiomas (FR-042). Las mismas claves en ambos: lo comprueba
// la prueba de paridad y, en el build, el cargador de contenido.
export type UiKey = keyof typeof es;
export type UiTexts = Record<UiKey, string>;

export const uiTexts: Record<Language, UiTexts> = { es, en };

export type Translate = (key: UiKey, values?: Record<string, string | number>) => string;

/** Devuelve el texto de interfaz de un idioma, sustituyendo `{nombre}` por su valor. */
export function translator(language: Language): Translate {
  const texts = uiTexts[language];
  return (key, values = {}) =>
    texts[key].replace(/\{(\w+)\}/g, (placeholder, name: string) =>
      name in values ? String(values[name]) : placeholder,
    );
}

/** Textos de la página de un caso, en la forma que recibe `CasePage`. */
export function caseLabels(t: Translate) {
  return {
    back: t("case.back"),
    eyebrowProduct: t("case.eyebrowProduct"),
    eyebrowMeta: t("case.eyebrowMeta"),
    summary: {
      title: t("case.summary.title"),
      product: t("case.summary.product"),
      role: t("case.summary.role"),
      team: t("case.summary.team"),
      duration: t("case.summary.duration"),
      keyResult: t("case.summary.keyResult"),
      kind: t("case.summary.kind"),
    },
  };
}
