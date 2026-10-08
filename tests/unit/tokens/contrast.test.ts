import { describe, expect, it } from "vitest";
import { compileMainScss, contrastRatio, readCssVariables } from "./helpers";

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
];

describe("contraste de tokens (SC-008)", () => {
  const variables = readCssVariables(compileMainScss());

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
