import { data } from "react-router";
import type { Language } from "../lib/i18n";
import {
  casePairs,
  cvAvailable,
  findPublishedCase,
  loadPage,
  loadProfile,
  publishedCases,
} from "./load.server";

// Datos que cada módulo de ruta pide en su loader, por idioma. El idioma lo fija el módulo
// (`routes/` para español y `routes/en/` para inglés), no la URL, para no depender del basename.

function siteData(language: Language) {
  const profile = loadProfile(language);
  return { profile, cvAvailable: cvAvailable(profile.cv), casePairs: casePairs() };
}

export function homeData(language: Language) {
  return {
    ...siteData(language),
    page: loadPage(language, "inicio"),
    cases: publishedCases(language, "product"),
    meta: publishedCases(language, "meta")[0] ?? null,
  };
}

export function caseData(language: Language, slug: string | undefined) {
  const found = slug ? findPublishedCase(language, slug) : undefined;
  if (!found || found.type !== "product") throw data(null, { status: 404 });
  return { ...siteData(language), case: found };
}

export function metaCaseData(language: Language) {
  const found = publishedCases(language, "meta")[0];
  if (!found) throw data(null, { status: 404 });
  return { ...siteData(language), case: found };
}
