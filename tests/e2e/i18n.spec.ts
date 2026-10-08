import { expect, test } from "@playwright/test";

const caseEs = "/trabajos/despacho/";
const caseEn = "/en/work/dispatch/";

test.describe("idioma: selector, lang, canónica y hreflang (FR-039 a FR-041)", () => {
  test("el español está en `/` sin detectar el idioma del navegador", async ({ browser }) => {
    const context = await browser.newContext({ locale: "en-US" });
    const page = await context.newPage();
    await page.goto(caseEs);

    await expect(page.locator("html")).toHaveAttribute("lang", "es");
    await context.close();
  });

  test("cada idioma declara su lang, su canónica y las alternativas", async ({ page }) => {
    for (const [path, lang, canonical] of [
      [caseEs, "es", caseEs],
      [caseEn, "en", caseEn],
    ] as const) {
      await page.goto(path);

      await expect(page.locator("html")).toHaveAttribute("lang", lang);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
        "href",
        new RegExp(`${canonical}$`),
      );
      await expect(page.locator('link[rel="alternate"][hreflang="es"]')).toHaveAttribute(
        "href",
        new RegExp(`${caseEs}$`),
      );
      await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute(
        "href",
        new RegExp(`${caseEn}$`),
      );
      await expect(page.locator('link[rel="alternate"][hreflang="x-default"]')).toHaveAttribute(
        "href",
        new RegExp(`${caseEs}$`),
      );
      await expect(page.locator("h1")).toHaveCount(1);
    }
  });

  test("el selector lleva al mismo caso en el otro idioma, y de vuelta", async ({ page }) => {
    await page.goto(caseEs);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Rediseño del flujo de despacho",
    );

    await page.getByRole("link", { name: "EN English" }).click();

    await expect(page).toHaveURL(/\/en\/work\/dispatch\/?$/);
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Dispatch flow redesign");
    await expect(page.getByRole("navigation", { name: "Main" })).toBeVisible();

    await page.getByRole("link", { name: "ES Español" }).click();

    await expect(page).toHaveURL(/\/trabajos\/despacho\/?$/);
    await expect(page.locator("html")).toHaveAttribute("lang", "es");
  });

  test("el caso meta tiene su par, con otra dirección en inglés", async ({ page }) => {
    await page.goto("/trabajos/este-portafolio/");
    await page.getByRole("link", { name: "EN English" }).click();

    await expect(page).toHaveURL(/\/en\/work\/this-portfolio\/?$/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("How I built this portfolio");
  });

  test("el pie y la interfaz están en el idioma de la página", async ({ page }) => {
    await page.goto(caseEn);

    await expect(page.getByRole("link", { name: "Download CV (PDF)" })).toHaveCount(0); // sin cv.pdf en el fixture
    await expect(page.getByText(/Designed and built by/)).toBeVisible();
    await expect(page.getByRole("link", { name: "Back to Work" })).toHaveAttribute(
      "href",
      /\/en\/#trabajos$/,
    );
  });

  test("las páginas de sección separadas no existen en inglés", async ({ request }) => {
    for (const path of ["/en/trabajos/", "/en/sobre-mi/", "/en/contacto/"]) {
      const response = await request.get(path);
      const html = await response.text();

      expect(response.status() === 404 || !html.includes('<html lang="en"')).toBe(true);
    }
  });

  test("el sitemap lista los dos idiomas con sus alternativas y sin redirecciones", async ({
    request,
  }) => {
    const xml = await (await request.get("/sitemap.xml")).text();

    for (const path of [caseEs, caseEn, "/trabajos/este-portafolio/", "/en/work/this-portfolio/"]) {
      expect(xml).toContain(`${path}</loc>`);
    }
    expect(xml).toMatch(/hreflang="en" href="[^"]*\/en\/"/);
    expect(xml).toMatch(/hreflang="es" href="[^"]*\/"/);
    expect(xml).not.toMatch(/\/trabajos\/<\/loc>/);
    expect(xml).not.toMatch(/\/sobre-mi\/<\/loc>/);
    expect(xml).not.toMatch(/\/contacto\/<\/loc>/);
  });

  test("sin JavaScript el selector sigue funcionando como enlace", async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto(caseEs);

    await page.getByRole("link", { name: "EN English" }).click();

    await expect(page).toHaveURL(/\/en\/work\/dispatch\/?$/);
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await context.close();
  });
});
