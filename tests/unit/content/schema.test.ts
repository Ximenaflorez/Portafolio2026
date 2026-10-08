import { describe, expect, it } from "vitest";
import { validateCase, validatePage, validateProfile } from "~/content/schema";

const body = `
## 1. Problema inicial

- **Contexto de negocio:** Plataforma B2B de logística de tamaño mediano.

## 2. Investigación y datos de usuario

- **Hallazgos:** El 60% de las tareas se abandonaba en el segundo paso.

## 3. Arquitectura de la solución

- **Decisiones clave:** Unificar dos flujos en uno, porque reducía pasos; se descartó un asistente guiado.

## 4. Resultados y aprendizajes

- **Resultados:** Entre 20% y 30% menos abandono.
- **Lo que no funcionó:** La primera versión del filtro confundía a los usuarios nuevos.
`;

function caseFile(frontmatter: string, content = body): string {
  return `---\n${frontmatter.trim()}\n---\n${content}`;
}

const publishedProduct = `
slug: logistica-b2b
type: product
status: published
order: 1
title: Rediseño del flujo de despacho
seo:
  title: Rediseño del flujo de despacho
  description: Caso de estudio sobre cómo se redujo el abandono en un flujo de despacho B2B.
summary:
  product: Plataforma B2B de logística
  role: Product Designer líder
  team: 1 PM, 4 devs, 1 QA
  duration: 6 meses
  keyResult: Entre 20% y 30% menos abandono
  indexLine: Menos abandono en el flujo de despacho
  productType: B2B SaaS
`;

describe("validateCase", () => {
  it("acepta un caso de producto publicado y completo", () => {
    const result = validateCase(caseFile(publishedProduct));
    expect(result.errors).toEqual([]);
    expect(result.data?.slug).toBe("logistica-b2b");
  });

  it("acepta un borrador incompleto", () => {
    const draft = caseFile(
      'slug: caso-01\ntype: product\nstatus: draft\norder: 1\ntitle: "[COMPLETAR: Nombre]"',
      "## 1. Problema inicial\n\n[COMPLETAR]",
    );
    expect(validateCase(draft).errors).toEqual([]);
  });

  it("rechaza un caso publicado con [COMPLETAR] (FR-026)", () => {
    const raw = caseFile(publishedProduct, body.replace("Entre 20% y 30%", "[COMPLETAR]"));
    expect(validateCase(raw).errors.join()).toMatch(/COMPLETAR/);
  });

  it("rechaza un caso publicado sin las cuatro secciones en orden (FR-002)", () => {
    const raw = caseFile(publishedProduct, body.replace("## 3. Arquitectura de la solución", ""));
    expect(validateCase(raw).errors.join()).toMatch(/Arquitectura de la solución/);
  });

  it("rechaza un caso publicado sin decisiones clave (FR-022)", () => {
    const raw = caseFile(publishedProduct, body.replace("**Decisiones clave:**", "**Notas:**"));
    expect(validateCase(raw).errors.join()).toMatch(/Decisiones clave/);
  });

  it("rechaza un caso publicado sin lo que no funcionó ni lo que haría distinto (FR-023)", () => {
    const raw = caseFile(publishedProduct, body.replace("**Lo que no funcionó:**", "**Notas:**"));
    expect(validateCase(raw).errors.join()).toMatch(/no funcionó/);
  });

  it("rechaza una imagen sin texto alternativo (FR-016)", () => {
    const raw = caseFile(publishedProduct, `${body}\n![](diagrama.png)\n`);
    expect(validateCase(raw).errors.join()).toMatch(/texto alternativo/);
  });

  it("rechaza una descripción SEO de menos de 50 caracteres", () => {
    const raw = caseFile(publishedProduct.replace(/description: .*/, "description: Muy corta"));
    expect(validateCase(raw).errors.join()).toMatch(/seo\.description/);
  });
});

describe("validateProfile", () => {
  const profile = `---
name: Ximena Alvarez
role: Product Designer
valueProposition: Diseño productos B2B claros y medibles.
email: hola@example.com
linkedin: https://www.linkedin.com/in/ejemplo
cv: /cv.pdf
---
`;

  it("acepta un perfil completo en modo estricto", () => {
    expect(validateProfile(profile, { strict: true }).errors).toEqual([]);
  });

  it("rechaza un correo inválido en modo estricto", () => {
    const raw = profile.replace("hola@example.com", "no-es-correo");
    expect(validateProfile(raw, { strict: true }).errors.join()).toMatch(/email/);
  });

  it("acepta espacios [COMPLETAR] fuera del modo estricto", () => {
    const raw = profile.replace("Ximena Alvarez", '"[COMPLETAR]"');
    expect(validateProfile(raw, { strict: false }).errors).toEqual([]);
  });
});

describe("validatePage", () => {
  const about = `---
seo:
  title: Sobre mí y proceso
  description: Cómo trabajo, qué métodos uso y qué problemas de producto busco resolver.
---
## Forma de trabajar

Texto.

## Métodos

Texto.

## Problemas que busco

Texto.
`;

  it("acepta Sobre mí con las tres secciones (FR-025)", () => {
    expect(validatePage(about, "sobre-mi", { strict: true }).errors).toEqual([]);
  });

  it("rechaza Sobre mí sin Métodos en modo estricto", () => {
    const raw = about.replace("## Métodos", "## Otros");
    expect(validatePage(raw, "sobre-mi", { strict: true }).errors.join()).toMatch(/Métodos/);
  });
});
