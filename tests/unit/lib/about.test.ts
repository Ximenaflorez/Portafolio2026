import { describe, expect, it } from "vitest";
import { methodItems, splitAbout } from "~/lib/about";

describe("splitAbout", () => {
  it("separa Forma de trabajar y Métodos por sus encabezados", () => {
    expect(
      splitAbout("## Forma de trabajar\n\nTexto de forma.\n\n## Métodos\n\nTexto de métodos.\n"),
    ).toEqual({ working: "Texto de forma.", methods: "Texto de métodos." });
  });

  it("acepta una lista en Métodos", () => {
    const methods = splitAbout(
      "## Forma de trabajar\n\nIntro.\n\n## Métodos\n\n- Uno\n- Dos\n",
    ).methods;
    expect(methodItems(methods)).toEqual(["Uno", "Dos"]);
  });

  it("sin lista no inventa ítems", () => {
    expect(methodItems("Texto de métodos.")).toEqual([]);
  });
});
