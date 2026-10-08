import { describe, expect, it } from "vitest";
import {
  compileMainScss,
  compileTokens,
  compileUtilities,
  readBaseVariable,
  readBlocks,
  readCssVariables,
} from "./helpers";

describe("encabezado fijo (FR-028, FR-043)", () => {
  const tokens = compileTokens();
  const variables = readCssVariables(tokens);

  it("la altura visible del encabezado se calcula con el objetivo mínimo, el espaciado y el borde", () => {
    expect(variables.get("--border-width")).toBe("1px");
    // Desde `sm` una sola fila: 44px de control + 2 × 8px de espaciado + 1px de borde.
    const wide = readBlocks(tokens).find(
      (block) => block.media?.includes("min-width") && block.variables.has("--header-height"),
    );
    expect(wide?.variables.get("--header-height")).toBe("61px");
  });

  it("en teléfono la fila fija lleva dos líneas (navegación; idioma y tema): 2 × 44px + 2 × 8px + 1px", () => {
    expect(readBaseVariable(tokens, "--header-height")).toBe("105px");
  });

  it("el cambio de altura ocurre en el mismo punto de corte en que el nombre deja de desplazarse", () => {
    const wide = readBlocks(tokens).find(
      (block) => block.media?.includes("min-width") && block.variables.has("--header-height"),
    );

    expect(wide?.media).toMatch(/min-width:\s*640px/);
  });

  it("en teléfono se oculta la fila del nombre: 8px de espaciado + 44px de control", () => {
    expect(variables.get("--header-collapse")).toBe("-52px");
  });

  it("Tailwind expone la posición del encabezado y el grosor del borde desde los tokens", async () => {
    const css = await compileUtilities(["top-header-collapse", "border-b", "scroll-pt-header"]);

    expect(css).toMatch(/\.top-header-collapse\s*{[^}]*top:\s*var\(--header-collapse\)/);
    expect(css).toMatch(/\.border-b\s*{[^}]*border-bottom-width:\s*var\(--border-width\)/);
    expect(css).toMatch(/\.scroll-pt-header\s*{[^}]*scroll-padding-top:\s*var\(--header-height\)/);
  });

  it("el documento reserva espacio bajo el encabezado y el anillo de foco al saltar a una sección o enfocar", () => {
    const css = compileMainScss();

    expect(css).toMatch(
      /html\s*{[^}]*scroll-padding-top:\s*calc\(var\(--header-height\)\s*\+\s*var\(--focus-ring-offset\)\s*\+\s*var\(--focus-ring-width\)\)/,
    );
  });
});
