import { describe, expect, it } from "vitest";
import { careerParityErrors, validateProfile, type Career } from "~/content/schema";

const base = `name: Ximena Alvarez
role: Product Designer
valueProposition: Diseño productos B2B claros y medibles.
email: hola@example.com
linkedin: https://www.linkedin.com/in/ejemplo
cv: /cv.pdf`;

const career = `career:
  experience:
    - title: UX Lead B2B
      organization: Magneto Empleos
      from: 2025-09
      summary: Definí la estrategia de UX B2B.
      tools: [Figma, Maze]
    - title: Diseñadora UX
      organization: Sistecrédito
      from: 2022-10
      to: 2024-07
  education:
    - title: Pregrado en Artes Visuales
      organization: Universidad de Antioquia
      from: 2017
  certificates:
    - title: Google Analytics
      organization: Google Skillshop
      from: 2025-02
      credentialUrl: https://skillshop.example.com/credencial`;

function profile(extra = career): string {
  return `---\n${base}\n${extra}\n---\n`;
}

describe("trayectoria en el perfil (FR-044)", () => {
  it("acepta los tres grupos, fechas AAAA y AAAA-MM y `to` ausente como actualidad", () => {
    const result = validateProfile(profile(), { strict: true });

    expect(result.errors).toEqual([]);
    const experience = result.data!.career!.experience!;
    expect(experience[0]).toMatchObject({ from: "2025-09", tools: ["Figma", "Maze"] });
    expect(experience[0].to).toBeUndefined();
    expect(result.data!.career!.education![0].from).toBe("2017");
  });

  it("los grupos son opcionales y el perfil puede no tener trayectoria", () => {
    expect(validateProfile(profile(""), { strict: true }).errors).toEqual([]);
    const soloEducacion = `career:\n  education:\n    - title: T\n      organization: O\n      from: 2017`;
    expect(validateProfile(profile(soloEducacion), { strict: true }).errors).toEqual([]);
  });

  it.each([
    ["una fecha inválida", career.replace("from: 2025-09", "from: septiembre"), /from/],
    ["un mes inválido", career.replace("from: 2025-09", "from: 2025-13"), /from/],
    ["un orden no descendente", career.replace("from: 2022-10", "from: 2026-01"), /orden/],
    [
      "una URL de credencial inválida",
      career.replace("https://skillshop.example.com/credencial", "no-es-url"),
      /credentialUrl/,
    ],
    ["herramientas repetidas", career.replace("[Figma, Maze]", "[Figma, Figma]"), /repetid/],
    ["una herramienta vacía", career.replace("[Figma, Maze]", '[Figma, ""]'), /tools/],
    ["un fin anterior al inicio", career.replace("to: 2024-07", "to: 2020-01"), /to/],
  ])("rechaza %s, también fuera del modo estricto", (_caso, raw, error) => {
    for (const strict of [true, false]) {
      expect(validateProfile(profile(raw), { strict }).errors.join()).toMatch(error);
    }
  });

  it("rechaza [COMPLETAR] en la trayectoria al publicar, y lo acepta en borrador", () => {
    const raw = career.replace("Definí la estrategia de UX B2B.", '"[COMPLETAR: logro]"');

    expect(validateProfile(profile(raw), { strict: true }).errors.join()).toMatch(/COMPLETAR/);
    expect(validateProfile(profile(raw), { strict: false }).errors).toEqual([]);
  });

  it("no aplica el anonimato: acepta nombres reales de empresas", () => {
    expect(validateProfile(profile(), { strict: true }).data!.career!.experience![0]).toMatchObject(
      { organization: "Magneto Empleos" },
    );
  });
});

describe("paridad de la trayectoria entre idiomas (FR-042)", () => {
  const es: Career = {
    experience: [
      { title: "Diseñadora UX", organization: "Sistecrédito", from: "2022-10", to: "2024-07" },
    ],
    certificates: [
      { title: "Desarrollo web", organization: "Coderhouse", from: "2022-11", credentialUrl: "https://a.example.com" },
    ],
  };
  const en: Career = {
    experience: [
      { title: "UX Designer", organization: "Sistecrédito", from: "2022-10", to: "2024-07" },
    ],
    certificates: [
      { title: "Web Development", organization: "Coderhouse", from: "2022-11", credentialUrl: "https://a.example.com" },
    ],
  };

  it("pasa si cambian solo los textos", () => {
    expect(careerParityErrors(es, en)).toEqual([]);
  });

  it("falla una entrada sin par en el otro idioma", () => {
    expect(careerParityErrors(es, { ...en, certificates: [] }).join()).toMatch(/certificates/);
    expect(careerParityErrors(es, undefined).join()).toMatch(/experience/);
  });

  it.each([
    ["from", { from: "2022-11" }],
    ["to", { to: undefined }],
  ])("falla una entrada con %s distinto", (campo, cambio) => {
    const otro = { ...en, experience: [{ ...en.experience![0], ...cambio }] };
    expect(careerParityErrors(es, otro).join()).toMatch(new RegExp(campo));
  });

  it("falla un enlace a la credencial distinto", () => {
    const otro = {
      ...en,
      certificates: [{ ...en.certificates![0], credentialUrl: "https://b.example.com" }],
    };
    expect(careerParityErrors(es, otro).join()).toMatch(/credentialUrl/);
  });

  it("falla herramientas distintas: no se traducen", () => {
    const conHerramientas = (tools: string[]) => ({
      experience: [{ ...es.experience![0], tools }],
    });
    expect(careerParityErrors(conHerramientas(["Figma"]), conHerramientas(["Miro"])).join()).toMatch(
      /tools/,
    );
  });
});
