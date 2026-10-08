import { describe, expect, it } from "vitest";
import {
  alternateLinks,
  casePath,
  defaultLanguage,
  equivalentPath,
  isHomePath,
  languageFromPath,
  languages,
  legacyRedirects,
  metaCasePath,
  otherLanguage,
  sectionPath,
  homePath,
  staticPaths,
  type CasePair,
} from "~/lib/i18n";

const pairs: CasePair[] = [
  { file: "caso-01", type: "product", slugs: { es: "rediseno-despacho", en: "dispatch-redesign" } },
  { file: "caso-02", type: "product", slugs: { es: "analitica", en: "analytics" } },
  { file: "este-portafolio", type: "meta", slugs: { es: "este-portafolio", en: "this-portfolio" } },
];

describe("idiomas (FR-039)", () => {
  it("hay dos idiomas y el español es el predeterminado", () => {
    expect(languages).toEqual(["es", "en"]);
    expect(defaultLanguage).toBe("es");
  });

  it("el selector lleva siempre al otro idioma", () => {
    expect(otherLanguage("es")).toBe("en");
    expect(otherLanguage("en")).toBe("es");
  });
});

describe("rutas de cada página en cada idioma", () => {
  it("la página principal de cada idioma", () => {
    expect(homePath("es")).toBe("/");
    expect(homePath("en")).toBe("/en/");
  });

  it("las secciones usan los mismos id en los dos idiomas", () => {
    expect(sectionPath("es", "trabajos")).toBe("/#trabajos");
    expect(sectionPath("en", "trabajos")).toBe("/en/#trabajos");
  });

  it("un caso de estudio vive en /trabajos/:slug/ y en /en/work/:slug/", () => {
    expect(casePath("es", "rediseno-despacho")).toBe("/trabajos/rediseno-despacho/");
    expect(casePath("en", "dispatch-redesign")).toBe("/en/work/dispatch-redesign/");
  });

  it("el caso meta tiene su propia ruta en cada idioma", () => {
    expect(metaCasePath("es")).toBe("/trabajos/este-portafolio/");
    expect(metaCasePath("en")).toBe("/en/work/this-portfolio/");
  });

  it("las páginas de sección separadas solo existen en español, como redirecciones", () => {
    expect(Object.keys(legacyRedirects).sort()).toEqual(["/contacto/", "/sobre-mi/", "/trabajos/"]);
    expect(legacyRedirects["/trabajos/"]).toBe("/#trabajos");
    expect(staticPaths("en")).toEqual(["/en/"]);
    expect(staticPaths("es")).toEqual(["/"]);
    for (const path of Object.keys(legacyRedirects)) {
      expect(staticPaths("en")).not.toContain(`/en${path}`);
    }
  });
});

describe("idioma de una ruta", () => {
  it.each([
    ["/", "es"],
    ["/trabajos/rediseno-despacho/", "es"],
    ["/trabajos/rediseno-despacho", "es"],
    ["/en", "en"],
    ["/en/", "en"],
    ["/en/work/dispatch-redesign/", "en"],
    ["/english/", "es"],
  ])("%s está en %s", (pathname, language) => {
    expect(languageFromPath(pathname)).toBe(language);
  });
});

describe("página principal", () => {
  it.each([
    ["/", true],
    ["/en", true],
    ["/en/", true],
    ["/trabajos/analitica/", false],
    ["/en/work/analytics/", false],
    ["/en/otra", false],
  ])("%s es principal: %s", (pathname, expected) => {
    expect(isHomePath(pathname)).toBe(expected);
  });
});

describe("página equivalente en el otro idioma (FR-040)", () => {
  it("la principal lleva a la principal", () => {
    expect(equivalentPath("/", "en", pairs)).toBe("/en/");
    expect(equivalentPath("/en/", "es", pairs)).toBe("/");
  });

  it("conserva la sección que se está viendo", () => {
    expect(equivalentPath("/", "en", pairs, "trabajos")).toBe("/en/#trabajos");
    expect(equivalentPath("/en/", "es", pairs, "sobre-mi")).toBe("/#sobre-mi");
  });

  it("un caso lleva al mismo caso, emparejado por el nombre de archivo", () => {
    expect(equivalentPath("/trabajos/rediseno-despacho/", "en", pairs)).toBe(
      "/en/work/dispatch-redesign/",
    );
    expect(equivalentPath("/en/work/analytics", "es", pairs)).toBe("/trabajos/analitica/");
  });

  it("el caso meta lleva al caso meta", () => {
    expect(equivalentPath("/trabajos/este-portafolio/", "en", pairs)).toBe(
      "/en/work/this-portfolio/",
    );
    expect(equivalentPath("/en/work/this-portfolio/", "es", pairs)).toBe(
      "/trabajos/este-portafolio/",
    );
  });

  it("en un caso no se arrastra la sección", () => {
    expect(equivalentPath("/trabajos/analitica/", "en", pairs, "trabajos")).toBe(
      "/en/work/analytics/",
    );
  });

  it("si el caso no tiene par o la ruta no existe, lleva a la principal del otro idioma", () => {
    expect(equivalentPath("/trabajos/no-existe/", "en", pairs)).toBe("/en/");
    expect(equivalentPath("/pagina-rara/", "en", pairs)).toBe("/en/");
  });

  it("al mismo idioma devuelve la misma página", () => {
    expect(equivalentPath("/trabajos/analitica/", "es", pairs)).toBe("/trabajos/analitica/");
  });
});

describe("alternativas hreflang (FR-041)", () => {
  it("la principal declara los dos idiomas y x-default en español", () => {
    expect(alternateLinks("/", pairs)).toEqual([
      { hreflang: "es", path: "/" },
      { hreflang: "en", path: "/en/" },
      { hreflang: "x-default", path: "/" },
    ]);
  });

  it("un caso declara su par, y lo mismo se obtiene desde el idioma en inglés", () => {
    const expected = [
      { hreflang: "es", path: "/trabajos/analitica/" },
      { hreflang: "en", path: "/en/work/analytics/" },
      { hreflang: "x-default", path: "/trabajos/analitica/" },
    ];

    expect(alternateLinks("/trabajos/analitica/", pairs)).toEqual(expected);
    expect(alternateLinks("/en/work/analytics/", pairs)).toEqual(expected);
  });
});
