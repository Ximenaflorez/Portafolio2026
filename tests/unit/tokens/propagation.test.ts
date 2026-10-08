import { describe, expect, it } from "vitest";
import { compileTokens, compileUtilities, readCssVariables } from "./helpers";

describe("propagación de tokens (SC-006)", () => {
  it("cambiar --color-primary en el origen cambia el valor que resuelven sus utilidades", () => {
    const original = readCssVariables(compileTokens()).get("--color-primary");
    const altered = readCssVariables(compileTokens({ primary: "1 2 3" })).get("--color-primary");

    expect(original).toBe("67 56 202");
    expect(altered).toBe("1 2 3");
  });

  it("las utilidades de Tailwind leen los tokens en lugar de valores literales", async () => {
    const css = await compileUtilities([
      "bg-primary",
      "text-text",
      "p-1",
      "text-base",
      "font-heading",
      "duration-state",
      "min-h-target",
      "max-w-content",
      "border-b-indicator",
      "border-control",
    ]);

    expect(css).toMatch(/\.bg-primary\s*{[^}]*rgb\(var\(--color-primary\)/);
    expect(css).toMatch(/\.text-text\s*{[^}]*rgb\(var\(--color-text\)/);
    expect(css).toMatch(/\.p-1\s*{[^}]*padding:\s*var\(--space-1\)/);
    expect(css).toMatch(/\.text-base\s*{[^}]*font-size:\s*var\(--text-step-0\)/);
    expect(css).toMatch(/\.font-heading\s*{[^}]*font-family:\s*var\(--font-heading\)/);
    expect(css).toMatch(/\.duration-state\s*{[^}]*transition-duration:\s*var\(--duration-state\)/);
    expect(css).toMatch(/\.min-h-target\s*{[^}]*min-height:\s*var\(--target-min\)/);
    expect(css).toMatch(/\.max-w-content\s*{[^}]*max-width:\s*var\(--content-max\)/);
    expect(css).toMatch(
      /\.border-b-indicator\s*{[^}]*border-bottom-width:\s*var\(--indicator-width\)/,
    );
    expect(css).toMatch(/\.border-control\s*{[^}]*border-width:\s*var\(--control-border-width\)/);
  });

  it("Tailwind no ofrece los valores por defecto de color, espaciado ni duración", async () => {
    const css = await compileUtilities(["bg-blue-500", "p-4", "duration-300", "text-6xl"]);

    expect(css).not.toMatch(/\.bg-blue-500/);
    expect(css).not.toMatch(/padding:\s*1rem/);
    expect(css).not.toMatch(/\.duration-300/);
    expect(css).not.toMatch(/\.text-6xl/);
  });
});
