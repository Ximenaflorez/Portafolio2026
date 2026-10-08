import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const componentsDir = path.resolve(__dirname, "../../../src/components");

const arbitraryClass = /(?:^|[\s"'`{])(?:[\w-]+:)*[\w-]+-\[[^\]]+\]/;
const inlineVisualStyle =
  /style=\{\{[^}]*\b(color|background|margin|padding|gap|fontSize|fontFamily|width|height|top|left|right|bottom)\s*:/;

// Los componentes no conocen el tema: cada token cambia de valor, no de nombre (FR-036).
const darkVariant = /(?:^|[\s"'`{])(?:[\w-]+:)*dark:[\w-]+/;
const readsTheme = /data-theme|prefers-color-scheme|matchMedia\(/;

export function findHardcodedValues(source: string): string[] {
  const problems: string[] = [];
  if (darkVariant.test(source)) problems.push("variante dark: de Tailwind");
  if (readsTheme.test(source)) problems.push("lee el tema directamente");
  if (arbitraryClass.test(source)) problems.push("clase arbitraria de Tailwind");
  if (inlineVisualStyle.test(source)) problems.push("estilo en línea con valor visual");
  return problems;
}

function listSourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) return listSourceFiles(full);
    return /\.(tsx?|jsx?)$/.test(entry) ? [full] : [];
  });
}

describe("detector de valores sueltos", () => {
  it.each([
    ['<p className="text-[#ff0000]">', "color arbitrario"],
    ['<div className="p-[13px]">', "espacio arbitrario"],
    ['<h1 className="md:text-[1.1rem]">', "tamaño arbitrario con variante"],
    ["<div style={{ margin: 12 }}>", "estilo en línea"],
    ['<p className="bg-surface dark:bg-background">', "variante dark:"],
    ['<p className="md:dark:text-text">', "variante dark: con otra variante"],
    ['document.documentElement.getAttribute("data-theme")', "lee data-theme"],
    ['window.matchMedia("(prefers-color-scheme: dark)")', "lee la preferencia del sistema"],
  ])("detecta %s (%s)", (source) => {
    expect(findHardcodedValues(source)).not.toHaveLength(0);
  });

  it("acepta utilidades basadas en tokens", () => {
    expect(findHardcodedValues('<p className="text-text p-2 md:text-lg">')).toHaveLength(0);
  });
});

describe("componentes sin valores sueltos (FR-011)", () => {
  it("ningún archivo de src/components usa valores visuales literales", () => {
    const offenders = listSourceFiles(componentsDir)
      .map((file) => ({ file, problems: findHardcodedValues(readFileSync(file, "utf8")) }))
      .filter(({ problems }) => problems.length > 0);
    expect(offenders).toEqual([]);
  });
});
