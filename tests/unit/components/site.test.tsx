import { act, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import { axe } from "vitest-axe";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SiteFooter } from "~/components/organisms/SiteFooter";
import { SiteHeader } from "~/components/organisms/SiteHeader";
import { SiteTemplate } from "~/components/templates/SiteTemplate";

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
    expect(clases).toContain("bg-background");
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

  it("repite la navegación con otro nombre accesible", () => {
    enRuta(<SiteFooter {...props} />);

    const nav = screen.getByRole("navigation", { name: "Pie de página" });
    expect(within(nav).getAllByRole("link")).toHaveLength(4);
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
