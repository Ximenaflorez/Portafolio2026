import { describe, expect, it } from "vitest";
import { extractSections, headingTitle, slugify, splitBySection } from "~/lib/case-sections";

const body = `Texto previo.

## 1. Problema inicial

Algo.

### Subtema

## Investigación y datos de usuario

Más.

## 3. Arquitectura de la solución

## Resultados y aprendizajes
`;

describe("slugify", () => {
  it("quita acentos y signos y separa con guiones", () => {
    expect(slugify("Investigación y datos de usuario")).toBe("investigacion-y-datos-de-usuario");
    expect(slugify("What I would do differently!")).toBe("what-i-would-do-differently");
  });
});

describe("headingTitle", () => {
  it("quita el prefijo numérico", () => {
    expect(headingTitle("1. Problema inicial")).toBe("Problema inicial");
    expect(headingTitle("Problema inicial")).toBe("Problema inicial");
  });
});

describe("extractSections", () => {
  it("lista solo los encabezados `##`, numerados en orden y sin prefijo", () => {
    expect(extractSections(body)).toEqual([
      { id: "problema-inicial", title: "Problema inicial", number: 1 },
      {
        id: "investigacion-y-datos-de-usuario",
        title: "Investigación y datos de usuario",
        number: 2,
      },
      { id: "arquitectura-de-la-solucion", title: "Arquitectura de la solución", number: 3 },
      { id: "resultados-y-aprendizajes", title: "Resultados y aprendizajes", number: 4 },
    ]);
  });
});

describe("splitBySection", () => {
  it("separa el texto previo y un bloque por sección", () => {
    const { intro, sections } = splitBySection(body);
    expect(intro.trim()).toBe("Texto previo.");
    expect(sections).toHaveLength(4);
    expect(sections[0]).toMatch(/^## 1\. Problema inicial/);
    expect(sections[0]).toContain("### Subtema");
  });

  it("sin texto previo, el primer bloque ya es una sección", () => {
    const { intro, sections } = splitBySection("## Uno\n\nA\n\n## Dos\n\nB");
    expect(intro).toBe("");
    expect(sections).toHaveLength(2);
  });
});
