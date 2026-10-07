import path from "node:path";
import postcss from "postcss";
import * as sass from "sass";
import tailwindcss from "tailwindcss";
import tailwindConfig from "../../../tailwind.config";

const stylesDir = path.resolve(__dirname, "../../../src/styles");

export function compileMainScss(): string {
  return sass.compile(path.join(stylesDir, "main.scss")).css;
}

export function compileTokens(colorOverrides: Record<string, string> = {}): string {
  const entries = Object.entries(colorOverrides)
    .map(([name, channels]) => `"${name}": ${channels}`)
    .join(", ");
  const config = entries ? ` with ($color-overrides: (${entries}))` : "";
  return sass.compileString(`@use "tokens"${config};`, { loadPaths: [stylesDir] }).css;
}

export function readCssVariables(css: string): Map<string, string> {
  const variables = new Map<string, string>();
  for (const match of css.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) {
    variables.set(match[1], match[2].trim());
  }
  return variables;
}

export async function compileUtilities(classes: string[]): Promise<string> {
  const result = await postcss([
    tailwindcss({ ...tailwindConfig, content: [{ raw: classes.join(" ") }] }),
  ]).process("@tailwind utilities;", { from: undefined });
  return result.css;
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
