import { describe, expect, it } from "vitest";
import {
  compileMainScss,
  compileTokens,
  compileUtilities,
  readBlocks,
  readCssVariables,
  readThemeColors,
} from "./helpers";

// Estilo aprobado el 2026-10-09: base Material 3 (píldora tonal con capa de estado, tarjetas
// tonales) y cristal de iOS solo en el encabezado fijo. Todo sale de tokens (FR-036).

describe("tokens de forma, estado y cristal del estilo nuevo", () => {
  const variables = readCssVariables(compileTokens());

  it("los botones son píldoras: la esquina es un token y Tailwind lo lee", async () => {
    const css = await compileUtilities(["rounded-button"]);

    expect(variables.get("--button-radius")).toBe("9999px");
    expect(css).toMatch(/\.rounded-button\s*{[^}]*border-radius:\s*var\(--button-radius\)/);
  });

  it("las tarjetas tienen esquinas de 16px (el espacio 2) y Tailwind las lee", async () => {
    const css = await compileUtilities(["rounded-card"]);

    expect(variables.get("--card-radius")).toBe("16px");
    expect(variables.get("--card-radius")).toBe(variables.get("--space-2"));
    expect(css).toMatch(/\.rounded-card\s*{[^}]*border-radius:\s*var\(--card-radius\)/);
  });

  it("la capa de estado es del 8 % con el puntero y del 16 % al presionar", async () => {
    const css = await compileUtilities(["opacity-state-hover", "opacity-state-press"]);

    expect(variables.get("--state-hover")).toBe("0.08");
    expect(variables.get("--state-press")).toBe("0.16");
    expect(css).toMatch(/\.opacity-state-hover\s*{[^}]*opacity:\s*var\(--state-hover\)/);
    expect(css).toMatch(/\.opacity-state-press\s*{[^}]*opacity:\s*var\(--state-press\)/);
  });

  it("Tailwind ofrece lo necesario para dibujar la capa de estado sobre el botón", async () => {
    const css = await compileUtilities(["rounded-inherit", "content-empty"]);

    expect(css).toMatch(/\.rounded-inherit\s*{[^}]*border-radius:\s*inherit/);
    expect(css).toMatch(/\.content-empty\s*{[^}]*content:\s*var\(--tw-content\)/);
    expect(css).toMatch(/--tw-content:\s*""/);
  });

  it("el cristal del encabezado se define con tokens: opacidad 90 %, desenfoque de 16px y saturación 1.5", () => {
    expect(variables.get("--header-alpha")).toBe("0.9");
    expect(variables.get("--header-blur")).toBe("16px");
    expect(variables.get("--header-blur")).toBe(variables.get("--space-2"));
    expect(variables.get("--header-saturate")).toBe("1.5");
  });

  it("la opacidad del cristal es un valor entre 0 y 1", () => {
    const alpha = Number(variables.get("--header-alpha"));
    expect(alpha).toBeGreaterThan(0);
    expect(alpha).toBeLessThanOrEqual(1);
  });
});

describe("colores tonales derivados del Primary", () => {
  it.each(["light", "dark"] as const)(
    "el tema %s define surface-tonal y secondary-container",
    (theme) => {
      const colors = readThemeColors(compileTokens(), theme);

      expect(colors.get("--color-surface-tonal")).toMatch(/^\d+ \d+ \d+$/);
      expect(colors.get("--color-secondary-container")).toMatch(/^\d+ \d+ \d+$/);
    },
  );

  it("los tonales se mezclan con el Primary de cada tema: cambiar el Primary los cambia", () => {
    const original = readThemeColors(compileTokens(), "light");
    const altered = readThemeColors(compileTokens({ primary: "0 0 0" }), "light");

    expect(altered.get("--color-secondary-container")).not.toBe(
      original.get("--color-secondary-container"),
    );
    expect(altered.get("--color-surface-tonal")).not.toBe(original.get("--color-surface-tonal"));
  });

  it("Tailwind ofrece surface-tonal y secondary-container desde los tokens", async () => {
    const css = await compileUtilities(["bg-surface-tonal", "bg-secondary-container"]);

    expect(css).toMatch(/\.bg-surface-tonal\s*{[^}]*rgb\(var\(--color-surface-tonal\)/);
    expect(css).toMatch(/\.bg-secondary-container\s*{[^}]*rgb\(var\(--color-secondary-container\)/);
  });
});

describe(".header-glass: encabezado traslúcido con respaldo sólido (FR-028, FR-037)", () => {
  const blocks = readBlocks(compileMainScss()).filter(
    (block) => block.selector === ".header-glass",
  );
  const base = blocks.find((block) => block.media === null);

  it("el fondo y el desenfoque salen de los tokens", () => {
    expect(base, "falta la regla .header-glass").toBeDefined();
    // Sass quita los espacios alrededor de `/`; no cambia el significado.
    expect(base!.declarations.get("background-color")?.replace(/\s*\/\s*/, " / ")).toBe(
      "rgb(var(--color-background) / var(--header-alpha))",
    );
    const filter = base!.declarations.get("backdrop-filter") ?? "";
    expect(filter).toContain("blur(var(--header-blur))");
    expect(filter).toContain("saturate(var(--header-saturate))");
  });

  it.each([
    ["prefers-reduced-transparency: reduce"],
    ["prefers-contrast: more"],
    ["forced-colors: active"],
  ])("con `%s` vuelve a un fondo sólido y sin desenfoque", (condicion) => {
    const regla = blocks.find((block) => block.media?.includes(condicion));

    expect(regla, `falta el respaldo para ${condicion}`).toBeDefined();
    expect(regla!.declarations.get("background-color")).toBe("rgb(var(--color-background))");
    expect(regla!.declarations.get("backdrop-filter")).toBe("none");
  });

  it("si el navegador no soporta `backdrop-filter` el fondo es sólido", () => {
    const regla = blocks.find((block) => block.media?.includes("backdrop-filter"));

    expect(regla, "falta el respaldo @supports not").toBeDefined();
    expect(regla!.media).toMatch(/^not /);
    expect(regla!.declarations.get("background-color")).toBe("rgb(var(--color-background))");
  });
});
