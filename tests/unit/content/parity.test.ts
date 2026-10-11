import { describe, expect, it } from "vitest";
import { assertContentParity } from "~/content/load.server";
import { uiTexts } from "~/lib/ui";
import {
  caseParityErrors,
  fileParityErrors,
  uiParityErrors,
  validateCase,
  validatePage,
  type CaseStudy,
} from "~/content/schema";

const bodyEn = `
## 1. Initial problem

- **Business context:** Mid-sized B2B logistics platform.

## 2. Research and user data

- **Findings:** 60% of the tasks were abandoned on the second step.

## 3. Solution architecture

- **Key decisions:** Merge two flows into one because it removed steps; a guided wizard was discarded.

## 4. Results and learnings

- **Results:** Between 20% and 30% less abandonment.
- **What didn't work:** The first version of the filter confused new users.
`;

const bodyEs = `
## 1. Problema inicial

- **Contexto de negocio:** Plataforma B2B de logística de tamaño mediano.

## 2. Investigación y datos de usuario

- **Hallazgos:** El 60% de las tareas se abandonaba en el segundo paso.

## 3. Arquitectura de la solución

- **Decisiones clave:** Unificar dos flujos en uno, porque reducía pasos.

## 4. Resultados y aprendizajes

- **Resultados:** Entre 20% y 30% menos abandono.
- **Lo que no funcionó:** La primera versión del filtro confundía a los usuarios nuevos.
`;

const frontmatter = (slug: string, description: string) => `
slug: ${slug}
type: product
status: published
order: 1
title: Dispatch flow redesign
seo:
  title: Dispatch flow redesign
  description: ${description}
summary:
  product: B2B logistics platform
  role: Lead Product Designer
  team: 1 PM, 4 devs, 1 QA
  duration: 6 months
  keyResult: Between 20% and 30% less abandonment
  indexLine: Less abandonment in the dispatch flow
  productType: B2B SaaS
  sector: Fintech
`;

const description = "Case study about how abandonment was reduced in a B2B dispatch flow.";

function file(slug: string, content: string): string {
  return `---\n${frontmatter(slug, description).trim()}\n---\n${content}`;
}

describe("encabezados y etiquetas por idioma (FR-042)", () => {
  it("acepta un caso en inglés con encabezados y etiquetas en inglés", () => {
    expect(validateCase(file("dispatch-redesign", bodyEn), "en").errors).toEqual([]);
  });

  it("rechaza un caso en inglés con encabezados en español", () => {
    const errors = validateCase(file("dispatch-redesign", bodyEs), "en").errors.join();

    expect(errors).toMatch(/Initial problem/);
    expect(errors).toMatch(/Key decisions/);
  });

  it("rechaza un caso en español con encabezados en inglés", () => {
    const errors = validateCase(file("rediseno-despacho", bodyEn)).errors.join();

    expect(errors).toMatch(/Problema inicial/);
  });

  it("Sobre mí exige sus dos secciones en el idioma de la página", () => {
    const aboutEn = `---\nseo:\n  title: About and process\n  description: ${description}\n---\n## Way of working\n\nText.\n\n## Methods\n\nText.\n`;

    expect(validatePage(aboutEn, "sobre-mi", { strict: true, language: "en" }).errors).toEqual([]);
    expect(
      validatePage(aboutEn, "sobre-mi", { strict: true, language: "es" }).errors.join(),
    ).toMatch(/Forma de trabajar/);
  });
});

function item(overrides: Partial<CaseStudy> = {}): CaseStudy {
  return {
    slug: "caso",
    type: "product",
    status: "published",
    order: 1,
    title: "t",
    seo: { title: "t", description: "d" },
    summary: { product: "p", role: "r", duration: "d", keyResult: "k" },
    body: "",
    ...overrides,
  };
}

describe("paridad de los casos entre idiomas (FR-042)", () => {
  it("pasa un par completo", () => {
    expect(
      caseParityErrors(
        { "caso-01.md": item({ slug: "caso" }) },
        { "caso-01.md": item({ slug: "case" }) },
      ),
    ).toEqual([]);
  });

  it("falla un archivo sin su par en el otro idioma, en los dos sentidos", () => {
    const errors = caseParityErrors({ "caso-01.md": item() }, { "case-02.md": item() });

    expect(errors.join()).toMatch(/caso-01\.md.*en/);
    expect(errors.join()).toMatch(/case-02\.md.*es/);
  });

  it.each([
    ["type", { type: "meta" as const }],
    ["status", { status: "draft" as const }],
    ["order", { order: 2 }],
  ])("falla un par con %s distinto", (field, change) => {
    const errors = caseParityErrors({ "caso-01.md": item() }, { "caso-01.md": item(change) });

    expect(errors.join()).toMatch(new RegExp(field));
  });

  it("falla un caso publicado cuyo par sigue en borrador", () => {
    const errors = caseParityErrors(
      { "caso-01.md": item() },
      { "caso-01.md": item({ status: "draft" }) },
    );

    expect(errors.join()).toMatch(/published|publicado/);
  });
});

describe("paridad de archivos de contenido", () => {
  it("pasa si ambos idiomas tienen los mismos archivos", () => {
    expect(fileParityErrors("pages", ["inicio.md"], ["inicio.md"])).toEqual([]);
  });

  it("falla si falta una página en un idioma", () => {
    expect(fileParityErrors("pages", ["inicio.md", "contacto.md"], ["inicio.md"]).join()).toMatch(
      /contacto\.md/,
    );
  });
});

describe("paridad de textos de interfaz (FR-042)", () => {
  it("pasa si las claves son las mismas y ninguna está vacía", () => {
    expect(uiParityErrors({ a: "uno", b: "dos" }, { a: "one", b: "two" })).toEqual([]);
  });

  it("falla una clave que falta en un idioma", () => {
    expect(uiParityErrors({ a: "uno", b: "dos" }, { a: "one" }).join()).toMatch(/b/);
    expect(uiParityErrors({ a: "uno" }, { a: "one", c: "three" }).join()).toMatch(/c/);
  });

  it("falla un texto vacío", () => {
    expect(uiParityErrors({ a: "uno" }, { a: "  " }).join()).toMatch(/a/);
  });
});

describe("contenido del repositorio", () => {
  it("src/content/es y src/content/en tienen paridad completa", () => {
    expect(() => assertContentParity()).not.toThrow();
  });

  it("los textos de interfaz tienen las mismas claves en los dos idiomas", () => {
    expect(uiParityErrors(uiTexts.es, uiTexts.en)).toEqual([]);
  });
});
