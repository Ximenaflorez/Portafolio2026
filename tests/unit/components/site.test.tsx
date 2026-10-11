import { act, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import { axe } from "vitest-axe";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SiteFooter } from "~/components/organisms/SiteFooter";
import { SiteHeader } from "~/components/organisms/SiteHeader";
import { SiteTemplate } from "~/components/templates/SiteTemplate";
import type { CasePair } from "~/lib/i18n";

const perfil = {
  name: "Nombre Apellido",
  email: "nombre@ejemplo.com",
  linkedin: "https://www.linkedin.com/in/ejemplo",
  cv: "/cv.pdf",
};

type Entrada = { isIntersecting: boolean; target: Element };
let observadores: Array<{ callback: (entradas: Entrada[]) => void; observados: Element[] }> = [];

class FakeIntersectionObserver {
  observados: Element[] = [];
  constructor(public callback: (entradas: Entrada[]) => void) {
    observadores.push(this);
  }
  observe(el: Element) {
    this.observados.push(el);
  }
  disconnect() {
    this.observados = [];
  }
  unobserve() {}
  takeRecords() {
    return [];
  }
}

function conSecciones() {
  for (const id of ["inicio", "trabajos", "sobre-mi", "contacto"]) {
    const el = document.createElement("section");
    el.id = id;
    document.body.appendChild(el);
  }
}

function reducirMovimiento(reducir: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: reducir && query.includes("reduce"),
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
  })) as unknown as typeof window.matchMedia;
}

function verSeccion(id: string) {
  const el = document.getElementById(id)!;
  act(() => {
    for (const obs of observadores) obs.callback([{ isIntersecting: true, target: el }]);
  });
}

beforeEach(() => {
  observadores = [];
  vi.stubGlobal("IntersectionObserver", FakeIntersectionObserver);
  reducirMovimiento(false);
  conSecciones();
});

afterEach(() => {
  document.body.innerHTML = "";
  document.documentElement.style.scrollBehavior = "";
  vi.unstubAllGlobals();
});

function enRuta(ui: React.ReactElement, ruta = "/") {
  return render(<MemoryRouter initialEntries={[ruta]}>{ui}</MemoryRouter>);
}

describe("SiteHeader (FR-028, FR-031)", () => {
  it("tiene la navegación Principal con los cuatro enlaces ancla a `/`", () => {
    enRuta(<SiteHeader name={perfil.name} />);

    const nav = screen.getByRole("navigation", { name: "Principal" });
    const hrefs = within(nav)
      .getAllByRole("link")
      .map((a) => a.getAttribute("href"));
    expect(hrefs).toEqual(["/#inicio", "/#trabajos", "/#sobre-mi", "/#contacto"]);
    expect(screen.getByRole("link", { name: perfil.name })).toHaveAttribute("href", "/#inicio");
  });

  it("es fijo: en teléfono solo queda la fila del menú y desde `sm` queda completo", () => {
    enRuta(<SiteHeader name={perfil.name} />);

    const clases = screen.getByRole("banner").className;
    expect(clases).toContain("sticky");
    expect(clases).toContain("top-header-collapse");
    expect(clases).toContain("sm:top-0");
    // Cristal aprobado el 2026-10-09: fondo traslúcido con el respaldo sólido de `.header-glass`.
    expect(clases).toContain("header-glass");
    expect(clases).not.toContain("bg-background");
    expect(clases).toContain("border-b");
    expect(clases).toContain("border-border");
  });

  it("marca Inicio al cargar y cambia a la sección que se ve", () => {
    enRuta(<SiteHeader name={perfil.name} />);
    const nav = screen.getByRole("navigation", { name: "Principal" });

    expect(within(nav).getByRole("link", { name: "Inicio" })).toHaveAttribute(
      "aria-current",
      "location",
    );

    verSeccion("sobre-mi");

    expect(within(nav).getByRole("link", { name: "Sobre mí" })).toHaveAttribute(
      "aria-current",
      "location",
    );
    expect(within(nav).getByRole("link", { name: "Inicio" })).not.toHaveAttribute("aria-current");
  });

  it("al llegar al final de la página marca la última sección", () => {
    enRuta(<SiteHeader name={perfil.name} />);
    const nav = screen.getByRole("navigation", { name: "Principal" });

    vi.spyOn(document.documentElement, "scrollHeight", "get").mockReturnValue(2000);
    Object.defineProperty(window, "innerHeight", { value: 800, configurable: true });
    Object.defineProperty(window, "scrollY", { value: 1200, configurable: true });
    act(() => {
      window.dispatchEvent(new Event("scroll"));
    });

    expect(within(nav).getByRole("link", { name: "Contacto" })).toHaveAttribute(
      "aria-current",
      "location",
    );
  });

  it("en la página de un caso no marca ninguna sección y los enlaces llevan a `/`", () => {
    enRuta(<SiteHeader name={perfil.name} />, "/trabajos/caso-01");
    const nav = screen.getByRole("navigation", { name: "Principal" });

    for (const enlace of within(nav).getAllByRole("link")) {
      expect(enlace).not.toHaveAttribute("aria-current");
      expect(enlace.getAttribute("href")).toMatch(/^\/#/);
    }
  });

  it("el desplazamiento al saltar es suave, salvo si se pide reducir movimiento (FR-029)", () => {
    enRuta(<SiteHeader name={perfil.name} />);
    expect(document.documentElement.style.scrollBehavior).toBe("smooth");

    document.documentElement.style.scrollBehavior = "";
    reducirMovimiento(true);
    enRuta(<SiteHeader name={perfil.name} />);
    expect(document.documentElement.style.scrollBehavior).toBe("auto");
  });

  it("no tiene violaciones de accesibilidad", async () => {
    const { container } = enRuta(<SiteHeader name={perfil.name} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("SiteFooter", () => {
  const props = {
    profile: perfil,
    cvAvailable: true,
    metaCaseHref: "/trabajos/este-portafolio",
    year: 2026,
  };

  it("muestra correo, LinkedIn y el CV como descarga", () => {
    enRuta(<SiteFooter {...props} />);

    expect(screen.getByRole("link", { name: perfil.email })).toHaveAttribute(
      "href",
      `mailto:${perfil.email}`,
    );
    expect(screen.getByRole("link", { name: "LinkedIn" })).toHaveAttribute("href", perfil.linkedin);
    const cv = screen.getByRole("link", { name: /CV/ });
    expect(cv).toHaveAttribute("href", "/cv.pdf");
    expect(cv).toHaveAttribute("download");
  });

  it("oculta el enlace al CV si el archivo falta", () => {
    enRuta(<SiteFooter {...props} cvAvailable={false} />);
    expect(screen.queryByRole("link", { name: /CV/ })).not.toBeInTheDocument();
  });

  it("no repite la navegación entre secciones: eso lo hace solo el encabezado", () => {
    enRuta(<SiteFooter {...props} />);

    expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Sobre mí" })).not.toBeInTheDocument();
  });

  it("incluye el crédito con enlace al caso meta, y el año", () => {
    enRuta(<SiteFooter {...props} />);

    expect(screen.getByRole("link", { name: "Cómo hice este portafolio" })).toHaveAttribute(
      "href",
      "/trabajos/este-portafolio",
    );
    expect(screen.getByText(/© 2026/)).toBeInTheDocument();
  });

  it("omite el enlace al caso meta cuando todavía no está publicado", () => {
    enRuta(<SiteFooter {...props} metaCaseHref={undefined} />);
    expect(
      screen.queryByRole("link", { name: "Cómo hice este portafolio" }),
    ).not.toBeInTheDocument();
  });

  it("no tiene violaciones de accesibilidad", async () => {
    const { container } = enRuta(<SiteFooter {...props} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("SiteTemplate (FR-017)", () => {
  const props = { profile: perfil, cvAvailable: true, metaCaseHref: "/trabajos/este-portafolio" };

  it("ordena: enlace para saltar, encabezado, contenido principal y pie", () => {
    enRuta(
      <SiteTemplate {...props}>
        <h1>Título</h1>
      </SiteTemplate>,
    );

    const skip = screen.getByRole("link", { name: "Saltar al contenido" });
    const header = screen.getByRole("banner");
    const main = screen.getByRole("main");
    const footer = screen.getByRole("contentinfo");

    expect(skip.compareDocumentPosition(header) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(header.compareDocumentPosition(main) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(main.compareDocumentPosition(footer) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(main).toHaveAttribute("id", "contenido");
    expect(main).toHaveAttribute("tabindex", "-1");
    expect(within(main).getByRole("heading", { name: "Título" })).toBeInTheDocument();
  });

  it("el primer Tab llega a «Saltar al contenido»", async () => {
    enRuta(
      <SiteTemplate {...props}>
        <h1>Título</h1>
      </SiteTemplate>,
    );

    await userEvent.tab();
    expect(screen.getByRole("link", { name: "Saltar al contenido" })).toHaveFocus();
  });

  it("no tiene violaciones de accesibilidad", async () => {
    const { container } = enRuta(
      <SiteTemplate {...props}>
        <h1>Título</h1>
      </SiteTemplate>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("Encabezado con selector de idioma y botón de tema (FR-017, FR-043)", () => {
  const pares: CasePair[] = [
    { file: "caso-01", type: "product", slugs: { es: "analitica", en: "analytics" } },
  ];

  it("agrupa idioma y tema en un mismo bloque, hermano del nombre y de la navegación", () => {
    enRuta(<SiteHeader name={perfil.name} />);

    const nav = screen.getByRole("navigation", { name: "Principal" });
    const controles = screen.getByRole("link", { name: "EN English" }).parentElement!;
    const nombre = screen.getByRole("link", { name: perfil.name }).parentElement!;

    expect(controles.contains(screen.getByRole("button", { name: "Tema oscuro" }))).toBe(true);
    expect(controles.contains(nav)).toBe(false);
    expect(nav.parentElement).toBe(controles.parentElement);
    expect(nombre.parentElement).toBe(controles.parentElement);
  });

  it("en teléfono idioma y tema van en la fila del nombre, a la derecha, y el menú en su propia fila", () => {
    enRuta(<SiteHeader name={perfil.name} />);

    const nombre = screen.getByRole("link", { name: perfil.name }).parentElement!;
    const nav = screen.getByRole("navigation", { name: "Principal" });
    const controles = screen.getByRole("link", { name: "EN English" }).parentElement!;

    expect(nombre.className).toContain("order-1");
    expect(controles.className).toContain("order-2");
    expect(controles.className).toContain("ml-auto");
    expect(nav.className).toContain("order-3");
    expect(nav.className).toContain("w-full");
  });

  it("desde `sm` todo va en una sola fila: nombre a la izquierda, menú y controles a la derecha", () => {
    enRuta(<SiteHeader name={perfil.name} />);

    const nombre = screen.getByRole("link", { name: perfil.name }).parentElement!;
    const nav = screen.getByRole("navigation", { name: "Principal" });
    const controles = screen.getByRole("link", { name: "EN English" }).parentElement!;

    expect(nombre.parentElement!.className).toContain("sm:flex-nowrap");
    expect(nombre.className).toContain("sm:mr-auto");
    expect(nav.className).toContain("sm:order-none");
    expect(nav.className).toContain("sm:w-auto");
    expect(controles.className).toContain("sm:order-none");
    expect(controles.className).toContain("sm:ml-0");
  });

  it("el orden en el documento es nombre, navegación, idioma y tema (el de la fila única de escritorio)", () => {
    enRuta(<SiteHeader name={perfil.name} />);

    const orden = Array.from(screen.getByRole("banner").querySelectorAll("a, button")).map((el) =>
      el.textContent?.trim(),
    );
    expect(orden[0]).toBe(perfil.name);
    expect(orden[1]).toBe("Inicio");
    expect(orden[orden.length - 2]).toMatch(/^EN/);
  });

  it("en español ofrece pasar a inglés: la misma página principal", () => {
    enRuta(<SiteHeader name={perfil.name} />);

    const idioma = screen.getByRole("link", { name: "EN English" });
    expect(idioma).toHaveAttribute("href", "/en/");
    expect(idioma).toHaveAttribute("hreflang", "en");
  });

  it("conserva la sección que se está viendo al cambiar de idioma", () => {
    enRuta(<SiteHeader name={perfil.name} />);

    verSeccion("trabajos");

    expect(screen.getByRole("link", { name: "EN English" })).toHaveAttribute(
      "href",
      "/en/#trabajos",
    );
  });

  it("desde un caso lleva al mismo caso en el otro idioma", () => {
    enRuta(<SiteHeader name={perfil.name} casePairs={pares} />, "/trabajos/analitica");

    expect(screen.getByRole("link", { name: "EN English" })).toHaveAttribute(
      "href",
      "/en/work/analytics/",
    );
  });

  it("en inglés todo el encabezado está en inglés y los enlaces llevan a `/en/`", () => {
    enRuta(<SiteHeader name={perfil.name} />, "/en/");

    const nav = screen.getByRole("navigation", { name: "Main" });
    expect(
      within(nav)
        .getAllByRole("link")
        .map((a) => [a.textContent, a.getAttribute("href")]),
    ).toEqual([
      ["Home", "/en/#inicio"],
      ["Work", "/en/#trabajos"],
      ["About", "/en/#sobre-mi"],
      ["Contact", "/en/#contacto"],
    ]);
    expect(screen.getByRole("link", { name: perfil.name })).toHaveAttribute("href", "/en/#inicio");
    expect(screen.getByRole("link", { name: "ES Español" })).toHaveAttribute("href", "/");
    expect(screen.getByRole("button", { name: "Dark theme" })).toBeInTheDocument();
  });

  it("en inglés marca la sección actual igual que en español", () => {
    enRuta(<SiteHeader name={perfil.name} />, "/en/");

    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("aria-current", "location");

    verSeccion("contacto");

    expect(screen.getByRole("link", { name: "Contact" })).toHaveAttribute(
      "aria-current",
      "location",
    );
  });

  it("no tiene violaciones de accesibilidad en inglés", async () => {
    const { container } = enRuta(<SiteHeader name={perfil.name} />, "/en/");
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("Pie y plantilla en inglés (FR-042)", () => {
  const props = { profile: perfil, cvAvailable: true, metaCaseHref: "/en/work/this-portfolio/" };

  it("el pie muestra sus textos en inglés", () => {
    enRuta(<SiteFooter {...props} year={2026} />, "/en/");

    expect(screen.getByRole("list", { name: "Contact" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Download CV (PDF)" })).toHaveAttribute("download");
    expect(screen.getByText(/Designed and built by Nombre Apellido/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "How I built this portfolio" })).toHaveAttribute(
      "href",
      "/en/work/this-portfolio/",
    );
    expect(screen.getByText(/© 2026/)).toBeInTheDocument();
  });

  it("el enlace para saltar al contenido está en el idioma de la página", async () => {
    enRuta(
      <SiteTemplate {...props}>
        <h1>Title</h1>
      </SiteTemplate>,
      "/en/",
    );

    await userEvent.tab();

    expect(screen.getByRole("link", { name: "Skip to content" })).toHaveFocus();
  });

  it("el orden de tabulación es: saltar, nombre, navegación, idioma, tema", async () => {
    enRuta(
      <SiteTemplate {...props}>
        <h1>Título</h1>
      </SiteTemplate>,
    );

    const esperados: Array<["link" | "button", string]> = [
      ["link", "Saltar al contenido"],
      ["link", perfil.name],
      ["link", "Inicio"],
      ["link", "Trabajos"],
      ["link", "Sobre mí"],
      ["link", "Contacto"],
      ["link", "EN English"],
      ["button", "Tema oscuro"],
    ];
    for (const [rol, nombre] of esperados) {
      await userEvent.tab();
      expect(document.activeElement).toBe(screen.getByRole(rol, { name: nombre }));
    }
  });
});
