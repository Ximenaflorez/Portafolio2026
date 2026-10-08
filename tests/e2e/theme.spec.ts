import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

// Página de caso de los fixtures: lleva los elementos globales (encabezado y pie).
const page_es = "/trabajos/despacho/";
const page_en = "/en/work/dispatch/";

const darkBackground = "12 10 9";
const lightBackground = "250 250 249";

function background(page: Page) {
  return page.evaluate(() =>
    getComputedStyle(document.documentElement).getPropertyValue("--color-background").trim(),
  );
}

function bodyColor(page: Page) {
  return page.evaluate(() => getComputedStyle(document.body).backgroundColor);
}

test.describe("tema: sigue al sistema, el botón lo cambia y lo recuerda (FR-036, FR-038)", () => {
  test("sin elección, el tema es el del sistema", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "dark" });
    await page.goto(page_es);
    expect(await background(page)).toBe(darkBackground);

    await page.emulateMedia({ colorScheme: "light" });
    expect(await background(page)).toBe(lightBackground);
  });

  test("el botón cambia el tema, mantiene su nombre y marca aria-pressed", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await page.goto(page_es);

    const toggle = page.getByRole("button", { name: "Tema oscuro" });
    await expect(toggle).toHaveAttribute("aria-pressed", "false");

    await toggle.click();

    await expect(toggle).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    expect(await background(page)).toBe(darkBackground);
    await expect(page.getByRole("button", { name: "Tema oscuro" })).toBeVisible();
  });

  test("la elección se recuerda al recargar y al cambiar de idioma", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await page.goto(page_es);
    await page.getByRole("button", { name: "Tema oscuro" }).click();

    await page.reload();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");

    await page.getByRole("link", { name: "EN English" }).click();
    await expect(page).toHaveURL(/\/en\/work\/dispatch\/?$/);
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    await expect(page.getByRole("button", { name: "Dark theme" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  test("elegir claro con el sistema en oscuro deja el tema claro", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "dark" });
    await page.goto(page_es);

    const toggle = page.getByRole("button", { name: "Tema oscuro" });
    await expect(toggle).toHaveAttribute("aria-pressed", "true");
    await toggle.click();

    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
    expect(await background(page)).toBe(lightBackground);
  });

  test("no hay destello: la elección se aplica antes de que cargue el JavaScript de la página", async ({
    page,
  }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await page.addInitScript(() => localStorage.setItem("theme", "dark"));
    // Sin el JavaScript de la aplicación, solo el script en línea del <head> puede fijar el tema.
    await page.route("**/*.js", (route) => route.abort());
    await page.goto(page_es);

    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    expect(await background(page)).toBe(darkBackground);
  });

  test("cambiar de tema no anima los colores", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await page.goto(page_es);
    await expect(page.getByRole("button", { name: "Tema oscuro" })).toBeVisible();

    const switching = await page.evaluate(() => {
      const link = document.querySelector("header nav a")!;
      const before = getComputedStyle(link).transitionDuration;
      document.querySelector<HTMLButtonElement>("button[aria-pressed]")!.click();
      return {
        before,
        flag: document.documentElement.hasAttribute("data-theme-switching"),
        during: getComputedStyle(link).transitionDuration,
      };
    });

    // En reposo los enlaces animan su estado; mientras cambia el tema, no.
    expect(switching.before).toBe("0.2s");
    expect(switching.flag).toBe(true);
    expect(switching.during).toBe("0s");
  });
});

test.describe("sin JavaScript (FR-038)", () => {
  test.use({ javaScriptEnabled: false });

  test("el tema sigue al sistema y no hay un botón que no funcione", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "dark" });
    await page.goto(page_es);

    expect(await bodyColor(page)).toBe("rgb(12, 10, 9)");
    await expect(page.getByRole("button", { name: "Tema oscuro" })).toHaveCount(0);
    await expect(page.getByRole("link", { name: "EN English" })).toBeVisible();
  });
});

for (const [language, path] of [
  ["español", page_es],
  ["inglés", page_en],
] as const) {
  for (const scheme of ["light", "dark"] as const) {
    test(`axe: caso en ${language}, tema ${scheme}`, async ({ page }) => {
      await page.emulateMedia({ colorScheme: scheme });
      await page.goto(path);
      await expect(page.getByRole("button", { name: /theme|tema/i })).toBeVisible();

      const result = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag22aa"])
        .analyze();

      expect(result.violations).toEqual([]);
    });
  }
}

test.describe("encabezado fijo con los controles (FR-028, FR-043)", () => {
  test("idioma y tema caben, miden 44×44 y no hay desbordamiento horizontal", async ({ page }) => {
    await page.goto(page_es);

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);

    for (const control of [
      page.getByRole("link", { name: "EN English" }),
      page.getByRole("button", { name: "Tema oscuro" }),
    ]) {
      await expect(control).toBeVisible();
      const box = (await control.boundingBox())!;
      expect(box.width).toBeGreaterThanOrEqual(44);
      expect(box.height).toBeGreaterThanOrEqual(44);
      expect(box.x).toBeGreaterThanOrEqual(0);
      expect(box.x + box.width).toBeLessThanOrEqual(page.viewportSize()!.width);
    }
  });

  test("la parte fija mide lo que dice --header-height al bajar la página", async ({ page }) => {
    await page.goto(page_es);
    await page.evaluate(() => window.scrollTo(0, 400));

    const { bottom, expected } = await page.evaluate(() => {
      const probe = document.createElement("div");
      probe.style.height = "var(--header-height)";
      document.body.appendChild(probe);
      const expectedHeight = probe.getBoundingClientRect().height;
      probe.remove();
      return {
        bottom: document.querySelector("header")!.getBoundingClientRect().bottom,
        expected: expectedHeight,
      };
    });

    expect(Math.round(bottom)).toBe(Math.round(expected));
  });

  test("al saltar a una sección o enfocar un control, el encabezado no lo tapa", async ({
    page,
  }) => {
    await page.goto(page_es);

    await page
      .getByRole("link", { name: /Resultados y aprendizajes/ })
      .first()
      .click();

    const { headerBottom, titleTop } = await page.evaluate(() => {
      const section = document.getElementById(location.hash.slice(1))!;
      return {
        headerBottom: document.querySelector("header")!.getBoundingClientRect().bottom,
        titleTop: section.querySelector("h2")!.getBoundingClientRect().top,
      };
    });
    expect(titleTop).toBeGreaterThanOrEqual(headerBottom);
  });
});
