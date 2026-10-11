import { describe, expect, it } from "vitest";
import {
  compileMainScss,
  compositeOver,
  contrastRatio,
  readCssVariables,
  readThemeColors,
  type Theme,
} from "./helpers";

const surfaces = ["background", "surface"];

const pairs: Array<{ foreground: string; backgrounds: string[]; minimum: number }> = [
  { foreground: "text", backgrounds: surfaces, minimum: 4.5 },
  { foreground: "text-muted", backgrounds: surfaces, minimum: 4.5 },
  // Botón secundario: texto y borde en Primary en reposo, con el puntero y al presionar.
  { foreground: "primary", backgrounds: surfaces, minimum: 4.5 },
  { foreground: "primary-hover", backgrounds: surfaces, minimum: 4.5 },
  { foreground: "primary-active", backgrounds: surfaces, minimum: 4.5 },
  { foreground: "error", backgrounds: surfaces, minimum: 4.5 },
  { foreground: "success", backgrounds: surfaces, minimum: 4.5 },
  {
    foreground: "on-primary",
    backgrounds: ["primary", "primary-hover", "primary-active"],
    minimum: 4.5,
  },
  { foreground: "focus", backgrounds: surfaces, minimum: 3 },
  { foreground: "border-strong", backgrounds: surfaces, minimum: 3 },
  // Tarjetas tonales: el texto y los enlaces se leen sobre el tinte.
  { foreground: "text", backgrounds: ["surface-tonal"], minimum: 4.5 },
  { foreground: "text-muted", backgrounds: ["surface-tonal"], minimum: 4.5 },
  { foreground: "primary", backgrounds: ["surface-tonal"], minimum: 4.5 },
  // Botón secundario tonal: etiqueta y contorno en Primary sobre el relleno tonal.
  { foreground: "primary", backgrounds: ["secondary-container"], minimum: 4.5 },
];

const themes: Theme[] = ["light", "dark"];

describe("contraste de tokens en cada tema (SC-008, FR-037)", () => {
  const css = compileMainScss();

  for (const theme of themes) {
    describe(`tema ${theme === "light" ? "claro" : "oscuro"}`, () => {
      const variables = readThemeColors(css, theme);

      it("define los 15 tokens de color (13 base y 2 tonales derivados del Primary)", () => {
        expect(variables.size).toBe(15);
      });

      it("el contorno del botón secundario (Primary) se distingue del fondo con 3:1", () => {
        const primary = variables.get("--color-primary")!;
        for (const surface of surfaces) {
          expect(
            contrastRatio(primary, variables.get(`--color-${surface}`)!),
          ).toBeGreaterThanOrEqual(3);
        }
      });

      for (const { foreground, backgrounds, minimum } of pairs) {
        for (const background of backgrounds) {
          it(`${foreground} sobre ${background} cumple ${minimum}:1`, () => {
            const fg = variables.get(`--color-${foreground}`);
            const bg = variables.get(`--color-${background}`);
            expect(fg, `falta --color-${foreground}`).toBeDefined();
            expect(bg, `falta --color-${background}`).toBeDefined();
            expect(contrastRatio(fg!, bg!)).toBeGreaterThanOrEqual(minimum);
          });
        }
      }
    });
  }
});

describe("capa de estado de los botones (FR-033, SC-008)", () => {
  const css = compileMainScss();
  const variables = readCssVariables(css);
  const estados = [
    ["con el puntero", "--state-hover"],
    ["al presionar", "--state-press"],
  ] as const;

  for (const theme of themes) {
    const colors = readThemeColors(css, theme);
    const color = (name: string) => colors.get(`--color-${name}`)!;

    for (const [nombre, token] of estados) {
      const opacidad = () => Number(variables.get(token));

      it(`tema ${theme}: la etiqueta del primario cumple 4.5:1 ${nombre}`, () => {
        const fondo = compositeOver(color("on-primary"), color("primary"), opacidad());
        expect(contrastRatio(color("on-primary"), fondo)).toBeGreaterThanOrEqual(4.5);
      });

      it(`tema ${theme}: la etiqueta del secundario cumple 4.5:1 ${nombre}`, () => {
        const fondo = compositeOver(color("primary"), color("secondary-container"), opacidad());
        expect(contrastRatio(color("primary"), fondo)).toBeGreaterThanOrEqual(4.5);
      });
    }
  }
});

describe("encabezado traslúcido en el peor caso (FR-028, FR-037)", () => {
  const css = compileMainScss();
  const alpha = Number(readCssVariables(css).get("--header-alpha"));
  // Con el cristal, detrás del encabezado puede haber cualquier cosa: el peor caso es
  // el tinte compuesto sobre blanco puro y sobre negro puro.
  const peores = ["255 255 255", "0 0 0"];
  const textos = ["text", "text-muted", "primary", "primary-hover", "primary-active"];

  for (const theme of themes) {
    const colors = readThemeColors(css, theme);
    for (const texto of textos) {
      for (const detras of peores) {
        it(`tema ${theme}: ${texto} cumple 4.5:1 sobre el tinte con ${detras === "0 0 0" ? "negro" : "blanco"} detrás`, () => {
          const fondo = compositeOver(colors.get("--color-background")!, detras, alpha);
          expect(contrastRatio(colors.get(`--color-${texto}`)!, fondo)).toBeGreaterThanOrEqual(4.5);
        });
      }
    }

    for (const detras of peores) {
      it(`tema ${theme}: el anillo de foco cumple 3:1 sobre el tinte con ${detras === "0 0 0" ? "negro" : "blanco"} detrás`, () => {
        const fondo = compositeOver(colors.get("--color-background")!, detras, alpha);
        expect(contrastRatio(colors.get("--color-focus")!, fondo)).toBeGreaterThanOrEqual(3);
      });
    }
  }
});
