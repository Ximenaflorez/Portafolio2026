import path from "node:path";
import postcss from "postcss";
import * as sass from "sass";
import tailwindcss from "tailwindcss";
import tailwindConfig from "../../../tailwind.config";

const stylesDir = path.resolve(__dirname, "../../../src/styles");

export function compileMainScss(): string {
  return sass.compile(path.join(stylesDir, "main.scss")).css;
}

function toScssMap(overrides: Record<string, string>): string {
  const entries = Object.entries(overrides)
    .map(([name, channels]) => `"${name}": ${channels}`)
    .join(", ");
  return `(${entries})`;
}

export function compileTokens(
  colorOverrides: Record<string, string> = {},
  darkColorOverrides: Record<string, string> = {},
): string {
  const settings: string[] = [];
  if (Object.keys(colorOverrides).length > 0) {
    settings.push(`$color-overrides: ${toScssMap(colorOverrides)}`);
  }
  if (Object.keys(darkColorOverrides).length > 0) {
    settings.push(`$color-overrides-dark: ${toScssMap(darkColorOverrides)}`);
  }
  const config = settings.length > 0 ? ` with (${settings.join(", ")})` : "";
  return sass.compileString(`@use "tokens"${config};`, { loadPaths: [stylesDir] }).css;
}

/** Último valor de cada variable del CSS, sin distinguir selectores. */
export function readCssVariables(css: string): Map<string, string> {
  const variables = new Map<string, string>();
  for (const match of css.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) {
    variables.set(match[1], match[2].trim());
  }
  return variables;
}

export type CssBlock = {
  /** Selector sin comillas ni espacios de más, para no depender de cómo lo emita Sass. */
  selector: string;
  /** Condición del `@media` que envuelve la regla, si la hay. */
  media: string | null;
  declarations: Map<string, string>;
  variables: Map<string, string>;
};

export function readBlocks(css: string): CssBlock[] {
  const blocks: CssBlock[] = [];
  postcss.parse(css).walkRules((rule) => {
    const declarations = new Map<string, string>();
    const variables = new Map<string, string>();
    rule.each((node) => {
      if (node.type !== "decl") return;
      declarations.set(node.prop, node.value);
      if (node.prop.startsWith("--")) variables.set(node.prop, node.value);
    });
    const parent = rule.parent;
    blocks.push({
      selector: rule.selector.replace(/["']/g, "").replace(/\s+/g, " ").trim(),
      media: parent && parent.type === "atrule" ? (parent as postcss.AtRule).params : null,
      declarations,
      variables,
    });
  });
  return blocks;
}

export const lightSelector = ":root";
export const darkSystemSelector = ":root:not([data-theme=light])";
export const darkChosenSelector = ":root[data-theme=dark]";

export type Theme = "light" | "dark";

/** Variables de color que resuelve cada tema, según los selectores de contracts/tokens.md. */
export function readThemeColors(css: string, theme: Theme): Map<string, string> {
  const blocks = readBlocks(css);
  const wanted =
    theme === "light"
      ? blocks.filter((block) => block.selector === lightSelector && block.media === null)
      : blocks.filter((block) => block.selector === darkChosenSelector);
  const colors = new Map<string, string>();
  for (const block of wanted) {
    for (const [name, value] of block.variables) {
      if (name.startsWith("--color-")) colors.set(name, value);
    }
  }
  return colors;
}

/** Variable que resuelve el bloque base (sin `@media`), p. ej. `--header-height` en teléfono. */
export function readBaseVariable(css: string, name: string): string | undefined {
  return readBlocks(css)
    .find(
      (block) =>
        block.selector === lightSelector && block.media === null && block.variables.has(name),
    )
    ?.variables.get(name);
}

export async function compileUtilities(classes: string[]): Promise<string> {
  const result = await postcss([
    tailwindcss({ ...tailwindConfig, content: [{ raw: classes.join(" ") }] }),
  ]).process("@tailwind utilities;", { from: undefined });
  return result.css;
}

/**
 * Color resultante de poner `top` con opacidad `alpha` sobre `bottom` (canales "r g b").
 * Es la composición que hace el navegador con una capa de estado o un fondo traslúcido.
 */
export function compositeOver(top: string, bottom: string, alpha: number): string {
  const [t, b] = [top, bottom].map((channels) => channels.split(/\s+/).map(Number));
  return t.map((channel, index) => channel * alpha + b[index] * (1 - alpha)).join(" ");
}

function channelToLinear(channel: number): number {
  const value = channel / 255;
  return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
}

function luminance(rgb: string): number {
  const [r, g, b] = rgb.split(/\s+/).map(Number);
  return 0.2126 * channelToLinear(r) + 0.7152 * channelToLinear(g) + 0.0722 * channelToLinear(b);
}

export function contrastRatio(foreground: string, background: string): number {
  const [light, dark] = [luminance(foreground), luminance(background)].sort((a, b) => b - a);
  return (light + 0.05) / (dark + 0.05);
}
