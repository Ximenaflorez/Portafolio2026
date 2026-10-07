import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const layers = ["atoms", "molecules", "organisms", "templates", "pages"] as const;
type Layer = (typeof layers)[number];

const componentsDir = path.resolve(__dirname, "../../../src/components");

export function importedLayers(source: string): Layer[] {
  const found = new Set<Layer>();
  for (const match of source.matchAll(/from\s+["']([^"']+)["']/g)) {
    const segment = match[1].match(/(?:components\/|\.\.\/)(atoms|molecules|organisms|templates|pages)\//);
    if (segment) found.add(segment[1] as Layer);
  }
  return [...found];
}

export function layerViolations(layer: Layer, source: string): Layer[] {
  const rank = layers.indexOf(layer);
  return importedLayers(source).filter((imported) => layers.indexOf(imported) > rank);
}

function listSourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) return listSourceFiles(full);
    return /\.(tsx?|jsx?)$/.test(entry) ? [full] : [];
  });
}

describe("detector de capas", () => {
  it("rechaza que un átomo importe una molécula", () => {
    expect(layerViolations("atoms", 'import { CaseCard } from "../molecules/CaseCard";')).toEqual([
      "molecules",
    ]);
  });

  it("rechaza que un organismo importe un template por alias", () => {
    expect(
      layerViolations("organisms", 'import { SiteTemplate } from "~/components/templates/SiteTemplate";'),
    ).toEqual(["templates"]);
  });

  it("acepta que una molécula importe átomos", () => {
    expect(layerViolations("molecules", 'import { TextLink } from "../atoms/TextLink";')).toEqual([]);
  });
});

describe("Atomic Design (Constitución, principio III)", () => {
  for (const layer of layers) {
    it(`ningún archivo de ${layer} importa una capa superior`, () => {
      const offenders = listSourceFiles(path.join(componentsDir, layer))
        .map((file) => ({ file, violations: layerViolations(layer, readFileSync(file, "utf8")) }))
        .filter(({ violations }) => violations.length > 0);
      expect(offenders).toEqual([]);
    });
  }
});
