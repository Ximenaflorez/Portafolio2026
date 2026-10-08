import { describe, expect, it } from "vitest";
import {
  compileMainScss,
  compileTokens,
  compileUtilities,
  darkChosenSelector,
  darkSystemSelector,
  lightSelector,
  readBlocks,
  readThemeColors,
} from "./helpers";

const tokenNames = [
  "background",
  "surface",
  "text",
  "text-muted",
  "primary",
  "primary-hover",
  "primary-active",
  "on-primary",
  "focus",
  "error",
  "success",
  "border",
  "border-strong",
];

describe("emisión de los dos temas (FR-036, contracts/tokens.md)", () => {
  const css = compileTokens();
  const blocks = readBlocks(css);
  const colorBlocks = blocks.filter((block) =>
    [...block.variables.keys()].some((name) => name.startsWith("--color-")),
  );

  it("emite los 13 tokens de color en el tema claro, en el oscuro por sistema y en el oscuro elegido", () => {
    const systemDark = colorBlocks.find((block) => block.selector === darkSystemSelector);
    const chosenDark = colorBlocks.find((block) => block.selector === darkChosenSelector);
    const light = colorBlocks.find((block) => block.selector === lightSelector);

    for (const block of [light, systemDark, chosenDark]) {
      expect(block, "falta un bloque de color").toBeDefined();
      for (const name of tokenNames) {
        expect(block!.variables.has(`--color-${name}`), `falta --color-${name}`).toBe(true);
      }
    }
  });

  it("el tema oscuro por sistema va dentro de prefers-color-scheme: dark", () => {
    const systemDark = colorBlocks.find((block) => block.selector === darkSystemSelector);

    expect(systemDark?.media).toMatch(/prefers-color-scheme:\s*dark/);
  });

  it("el oscuro por sistema y el oscuro elegido resuelven exactamente los mismos valores", () => {
    const systemDark = colorBlocks.find((block) => block.selector === darkSystemSelector)!;
    const chosenDark = colorBlocks.find((block) => block.selector === darkChosenSelector)!;

    expect([...systemDark.variables]).toEqual([...chosenDark.variables]);
  });

  it("el tema oscuro cambia valores, no nombres de variable", () => {
    const light = readThemeColors(css, "light");
    const dark = readThemeColors(css, "dark");

    expect([...dark.keys()]).toEqual([...light.keys()]);
    expect(dark.get("--color-background")).not.toBe(light.get("--color-background"));
  });

  it("color-scheme sigue al tema que se ve", () => {
    const find = (selector: string) =>
      blocks.find((block) => block.selector === selector && block.declarations.has("color-scheme"));

    expect(find(lightSelector)?.declarations.get("color-scheme")).toBe("light");
    expect(find(darkSystemSelector)?.declarations.get("color-scheme")).toBe("dark");
    expect(find(darkChosenSelector)?.declarations.get("color-scheme")).toBe("dark");
  });

  it("el tema oscuro por sistema no pisa la elección de tema claro", () => {
    expect(darkSystemSelector).toContain(":not([data-theme=light])");
  });

  it("al cambiar de tema se suspenden las transiciones de color", () => {
    const main = readBlocks(compileMainScss());
    const switching = main.find((block) =>
      block.selector.startsWith(":root[data-theme-switching] *"),
    );

    expect(switching?.declarations.get("transition")).toMatch(/^none/);
  });
});

describe("propagación de los tokens oscuros (SC-006)", () => {
  it("cambiar un token oscuro en el origen solo cambia el tema oscuro", () => {
    const original = compileTokens();
    const altered = compileTokens({}, { primary: "1 2 3" });

    expect(readThemeColors(original, "dark").get("--color-primary")).toBe("165 180 252");
    expect(readThemeColors(altered, "dark").get("--color-primary")).toBe("1 2 3");
    expect(readThemeColors(altered, "light").get("--color-primary")).toBe("67 56 202");
  });

  it("cambiar un token claro no cambia el tema oscuro", () => {
    const altered = compileTokens({ primary: "1 2 3" });

    expect(readThemeColors(altered, "light").get("--color-primary")).toBe("1 2 3");
    expect(readThemeColors(altered, "dark").get("--color-primary")).toBe("165 180 252");
  });

  it("la utilidad de Tailwind lee la misma variable en los dos temas, sin variante dark", async () => {
    const css = await compileUtilities(["bg-primary", "text-text"]);

    expect(css).toMatch(/\.bg-primary\s*{[^}]*rgb\(var\(--color-primary\)/);
    expect(css).not.toMatch(/prefers-color-scheme|data-theme/);
  });
});
