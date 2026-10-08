import { describe, expect, it } from "vitest";
import { canonicalUrl, pageMeta } from "~/lib/seo";

describe("URL canónica por idioma (FR-041)", () => {
  it("el español no lleva prefijo y el inglés vive bajo /en/", () => {
    expect(canonicalUrl("/")).toMatch(/\/$/);
    expect(canonicalUrl("/en/")).toMatch(/\/en\/$/);
    expect(canonicalUrl("/en/work/analytics")).toMatch(/\/en\/work\/analytics\/$/);
  });
});

describe("metadatos de una página (FR-014, FR-041)", () => {
  const base = { title: "Título", description: "Descripción de la página.", path: "/en/" };

  it("incluye título, descripción y canónica", () => {
    const meta = pageMeta(base);

    expect(meta).toContainEqual({ title: "Título" });
    expect(meta).toContainEqual({ name: "description", content: "Descripción de la página." });
    expect(meta).toContainEqual({
      tagName: "link",
      rel: "canonical",
      href: canonicalUrl("/en/"),
    });
  });

  it("declara las alternativas hreflang con URL absoluta", () => {
    const meta = pageMeta({
      ...base,
      alternates: [
        { hreflang: "es", path: "/" },
        { hreflang: "en", path: "/en/" },
        { hreflang: "x-default", path: "/" },
      ],
    });

    expect(meta).toContainEqual({
      tagName: "link",
      rel: "alternate",
      hrefLang: "es",
      href: canonicalUrl("/"),
    });
    expect(meta).toContainEqual({
      tagName: "link",
      rel: "alternate",
      hrefLang: "en",
      href: canonicalUrl("/en/"),
    });
    expect(meta).toContainEqual({
      tagName: "link",
      rel: "alternate",
      hrefLang: "x-default",
      href: canonicalUrl("/"),
    });
  });

  it("sin alternativas no añade ninguna", () => {
    const links = pageMeta(base).filter((item) => "rel" in item && item.rel === "alternate");

    expect(links).toEqual([]);
  });
});
