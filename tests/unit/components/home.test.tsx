import { render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { axe } from "vitest-axe";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ContactList } from "~/components/molecules/ContactList";
import { ProfileIntro } from "~/components/organisms/ProfileIntro";
import { HomePage } from "~/components/pages/HomePage";
import { NotFoundPage } from "~/components/pages/NotFoundPage";
import { ContentTemplate } from "~/components/templates/ContentTemplate";
import type { CaseStudy, Profile } from "~/content/schema";

beforeEach(() => {
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      observe() {}
      disconnect() {}
      unobserve() {}
      takeRecords() {
        return [];
      }
    },
  );
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
  })) as unknown as typeof window.matchMedia;
});

function enRuta(ui: React.ReactElement, ruta = "/") {
  return render(<MemoryRouter initialEntries={[ruta]}>{ui}</MemoryRouter>);
}

const perfil: Profile = {
  name: "Ximena Alvarez",
  role: "Senior Product Designer y UX/UI Lead",
  valueProposition: "Trabajo con equipos de producto para simplificar flujos complejos.",
  email: "nombre@ejemplo.com",
  linkedin: "https://www.linkedin.com/in/ejemplo",
  cv: "/cv.pdf",
};

function caso(
  file: Partial<CaseStudy> & { slug: string; order: number },
  sector = "Fintech",
): CaseStudy {
  return {
    type: "product",
    status: "published",
    title: `Caso ${file.slug}`,
    seo: { title: "t", description: "d" },
    summary: {
      product: "Producto",
      role: "Product Designer líder",
      team: "Equipo",
      duration: "6 meses",
      keyResult: "Resultado clave",
      indexLine: `Resultado de ${file.slug}`,
      productType: "B2B SaaS",
      sector,
    },
    body: "",
    ...file,
  };
}

const casos = [
  caso({ slug: "pagos", order: 1 }),
  caso({ slug: "seleccion", order: 2 }, "ATS"),
  caso({ slug: "estudio", order: 3 }, "Research"),
];
const meta = caso({
  slug: "este-portafolio",
  order: 4,
  type: "meta",
  title: "Cómo construí este portafolio",
  summary: {
    product: "Este portafolio",
    role: "Diseño y desarrollo",
    duration: "2 meses",
    keyResult: "Un sistema de diseño con tokens",
    sector: "Design system",
  },
});

const sobreMi = "## Forma de trabajar\n\nTexto de forma.\n\n## Métodos\n\nTexto de métodos.\n";

describe("ContactList (FR-005, FR-034)", () => {
  const props = {
    email: perfil.email,
    linkedin: perfil.linkedin,
    cv: perfil.cv,
    label: "Contacto",
    cvLabel: "Descargar CV (PDF)",
  };

  it("es una lista con nombre que solo tiene enlaces: correo, LinkedIn y CV", () => {
    enRuta(<ContactList {...props} />);

    const lista = screen.getByRole("list", { name: "Contacto" });
    expect(within(lista).getAllByRole("listitem")).toHaveLength(3);
    expect(within(lista).getByRole("link", { name: perfil.email })).toHaveAttribute(
      "href",
      `mailto:${perfil.email}`,
    );
    expect(within(lista).getByRole("link", { name: "LinkedIn" })).toHaveAttribute(
      "href",
      perfil.linkedin,
    );
    const cv = within(lista).getByRole("link", { name: "Descargar CV (PDF)" });
    expect(cv).toHaveAttribute("href", "/cv.pdf");
    expect(cv).toHaveAttribute("download");
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
  });

  it("en actions son píldoras con el icono a la derecha", () => {
    enRuta(<ContactList {...props} variant="actions" emailLabel="Email" />);

    const lista = screen.getByRole("list", { name: "Contacto" });
    const correo = within(lista).getByRole("link", { name: "Email" });
    const linkedin = within(lista).getByRole("link", { name: "LinkedIn" });
    const cv = within(lista).getByRole("link", { name: "Descargar CV (PDF)" });

    expect(correo).toHaveAttribute("href", `mailto:${perfil.email}`);
    expect(correo.className).toContain("bg-primary");
    expect(linkedin).toHaveAttribute("href", perfil.linkedin);
    expect(linkedin.className).toContain("bg-secondary-container");
    expect(cv).toHaveAttribute("download");
    for (const enlace of [correo, linkedin, cv]) {
      const icono = enlace.querySelector("svg");
      expect(icono).toHaveAttribute("aria-hidden", "true");
      expect(enlace.lastElementChild).toBe(icono);
    }
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
  });

  it("sin CV no muestra su enlace", () => {
    enRuta(<ContactList {...props} cv={undefined} />);
    expect(screen.queryByRole("link", { name: /CV/ })).not.toBeInTheDocument();
  });

  it("no tiene violaciones de accesibilidad", async () => {
    const { container } = enRuta(<ContactList {...props} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("ProfileIntro (FR-018)", () => {
  const props = {
    name: perfil.name,
    role: perfil.role,
    valueProposition: perfil.valueProposition,
    email: perfil.email,
    workHref: "/#trabajos",
    headingId: "titulo-inicio",
    photo: { src: "/perfil.jpg", alt: "Foto de Ximena Alvarez" },
    labels: { work: "Ver mis trabajos", contact: "Escríbeme" },
    stats: [
      { value: "4+", label: "años diseñando producto" },
      { value: "4", label: "casos de producto publicados" },
      { value: "20–30%", label: "menos abandono en flujo de despacho" },
    ],
  };

  it("muestra la foto, el nombre como h1, el rol y la propuesta de valor, en ese orden", () => {
    enRuta(<ProfileIntro {...props} />);

    const foto = screen.getByRole("img", { name: "Foto de Ximena Alvarez" });
    const h1 = screen.getByRole("heading", { level: 1, name: perfil.name });
    const rol = screen.getByText(perfil.role);
    const propuesta = screen.getByText(perfil.valueProposition);

    expect(h1).toHaveAttribute("id", "titulo-inicio");
    expect(foto.compareDocumentPosition(h1) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(h1.compareDocumentPosition(rol) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(rol.compareDocumentPosition(propuesta) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it("la foto es cuadrada, con borde Primary y las esquinas aprobadas", () => {
    enRuta(<ProfileIntro {...props} />);

    const clases = screen.getByRole("img").className;
    for (const clase of ["aspect-square", "border-photo", "border-primary", "rounded-photo"]) {
      expect(clases).toContain(clase);
    }
  });

  it("muestra las cifras de años, casos y resultado debajo de los botones", () => {
    enRuta(<ProfileIntro {...props} />);

    const contacto = screen.getByRole("link", { name: "Escríbeme" });
    const anios = screen.getByText("años diseñando producto");
    expect(contacto.compareDocumentPosition(anios) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(screen.getByText("4+")).toBeInTheDocument();
    expect(screen.getByText("4")).toBeInTheDocument();
    expect(screen.getByText("20–30%")).toBeInTheDocument();
    expect(screen.getByText("casos de producto publicados")).toBeInTheDocument();
    expect(screen.getByText("menos abandono en flujo de despacho")).toBeInTheDocument();
  });

  it("el botón primario lleva a Trabajos y el secundario abre el correo", () => {
    enRuta(<ProfileIntro {...props} />);

    const trabajos = screen.getByRole("link", { name: "Ver mis trabajos" });
    const correo = screen.getByRole("link", { name: "Escríbeme" });
    expect(trabajos).toHaveAttribute("href", "/#trabajos");
    expect(trabajos.className).toContain("bg-primary");
    expect(correo).toHaveAttribute("href", `mailto:${perfil.email}`);
    expect(correo.className).toContain("bg-secondary-container");
  });

  it("no tiene violaciones de accesibilidad", async () => {
    const { container } = enRuta(<ProfileIntro {...props} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("ContentTemplate (contracts/routes.md)", () => {
  it("envuelve la intro y cada sección en un <section> con su id y su encabezado h2", () => {
    const { container } = enRuta(
      <ContentTemplate
        intro={<h1 id="titulo-inicio">Nombre</h1>}
        sections={[
          { id: "trabajos", title: "Trabajos", children: <p>A</p> },
          { id: "sobre-mi", title: "Sobre mí y proceso", children: <p>B</p> },
          {
            id: "contacto",
            title: "Hagamos un buen producto.",
            eyebrow: "05 / Contacto",
            children: <p>C</p>,
          },
        ]}
      />,
    );

    const ids = Array.from(container.querySelectorAll("section")).map((s) => s.id);
    expect(ids).toEqual(["inicio", "trabajos", "sobre-mi", "contacto"]);
    expect(container.querySelector("#inicio")).toHaveAttribute("aria-labelledby", "titulo-inicio");
    for (const [id, nombre] of [
      ["trabajos", "Trabajos"],
      ["sobre-mi", "Sobre mí y proceso"],
      ["contacto", "Hagamos un buen producto."],
    ]) {
      const seccion = container.querySelector(`#${id}`) as HTMLElement;
      expect(within(seccion).getByRole("heading", { level: 2, name: nombre })).toBeInTheDocument();
      expect(seccion).toHaveAttribute("aria-labelledby", `titulo-${id}`);
    }
    expect(
      within(container.querySelector("#contacto") as HTMLElement).getByText("05 / Contacto"),
    ).toBeInTheDocument();
  });
});

describe("HomePage (FR-018, FR-019, FR-025, FR-034)", () => {
  function pagina(ruta = "/", conMeta = true) {
    return enRuta(
      <HomePage
        profile={perfil}
        cvAvailable
        cases={casos}
        meta={conMeta ? meta : null}
        about={sobreMi}
        contactCall="Escríbeme para colaborar."
      />,
      ruta,
    );
  }

  it("tiene un solo h1, el nombre, y las secciones en orden", () => {
    const { container } = pagina();

    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(perfil.name);
    const main = screen.getByRole("main");
    const ids = Array.from(main.querySelectorAll(":scope section[id]"))
      .map((s) => s.id)
      .filter((id) => ["inicio", "trabajos", "sobre-mi", "contacto"].includes(id));
    expect(ids).toEqual(["inicio", "trabajos", "sobre-mi", "contacto"]);
    expect(container.querySelector("#inicio img")).toHaveAttribute("src", "/perfil.jpg");
    expect(screen.getByRole("img", { name: `Foto de ${perfil.name}` })).toBeInTheDocument();
    expect(screen.getByText("años diseñando producto")).toBeInTheDocument();
    expect(screen.getByText("casos de producto publicados")).toBeInTheDocument();
    expect(screen.getByText("menos abandono en flujo de despacho")).toBeInTheDocument();
  });

  it("no tiene una sección aparte de Lo que hago", () => {
    pagina();
    expect(document.getElementById("lo-que-hago")).toBeNull();
  });

  it("Trabajos muestra el índice, el título y los tres casos más el caso meta como cuarta tarjeta, con su rubro", () => {
    pagina();

    const trabajos = document.getElementById("trabajos")!;
    expect(within(trabajos).getByText("01 / Trabajos")).toBeInTheDocument();
    const titulo = within(trabajos).getByRole("heading", {
      level: 2,
      name: "Menos fricción. Más impacto.",
    });
    expect(titulo).toHaveAttribute("id", "titulo-trabajos");
    expect(titulo.className).toContain("text-3xl");
    const tarjetas = within(trabajos).getAllByRole("listitem");
    expect(tarjetas).toHaveLength(4);
    expect(tarjetas.map((t) => within(t).getByRole("heading", { level: 3 }).textContent)).toEqual([
      "Caso pagos",
      "Caso seleccion",
      "Caso estudio",
      "Cómo construí este portafolio",
    ]);
    expect(within(tarjetas[0]).getByRole("link")).toHaveAttribute("href", "/trabajos/pagos/");
    expect(within(tarjetas[3]).getByRole("link")).toHaveAttribute(
      "href",
      "/trabajos/este-portafolio/",
    );
    expect(within(tarjetas[1]).getByText("ATS")).toBeInTheDocument();
    expect(within(tarjetas[1]).getByText("Resultado de seleccion")).toBeInTheDocument();
    expect(within(tarjetas[3]).getByText("Un sistema de diseño con tokens")).toBeInTheDocument();
  });

  it("la tarjeta usa la primera imagen del caso cuando el cuerpo la trae", () => {
    enRuta(
      <HomePage
        profile={perfil}
        cvAvailable
        cases={[
          caso({
            slug: "pagos",
            order: 1,
            body: '![Pantalla de despacho](/casos/despacho.jpg "Figura")',
          }),
        ]}
        meta={null}
        about={sobreMi}
        contactCall="Escríbeme para colaborar."
      />,
    );

    const imagen = within(document.getElementById("trabajos")!).getByRole("img", {
      name: "Pantalla de despacho",
    });
    expect(imagen).toHaveAttribute("src", "/casos/despacho.jpg");
  });

  it("sin caso meta publicado muestra solo los tres de producto", () => {
    pagina("/", false);
    expect(within(document.getElementById("trabajos")!).getAllByRole("listitem")).toHaveLength(3);
  });

  it("Sobre mí pone las tres líneas como tarjetas bajo el texto, sin Trayectoria si no hay entradas", () => {
    pagina();

    const sobreMiSeccion = document.getElementById("sobre-mi")!;
    expect(sobreMiSeccion).toHaveAttribute("aria-labelledby", "titulo-sobre-mi");
    expect(within(sobreMiSeccion).getByText("02 / Sobre mí")).toBeInTheDocument();
    expect(
      within(sobreMiSeccion).getByRole("heading", {
        level: 2,
        name: "Del problema al sistema.",
      }),
    ).toHaveAttribute("id", "titulo-sobre-mi");
    expect(within(sobreMiSeccion).getByText("Texto de forma.")).toBeInTheDocument();
    expect(
      within(sobreMiSeccion).getByText(/Entrevistas, auditorías de usabilidad/),
    ).toBeInTheDocument();
    expect(within(sobreMiSeccion).getByText(/Componentes atómicos y tokens/)).toBeInTheDocument();
    expect(
      within(sobreMiSeccion).getByText(/Decisiones de diseño medibles/),
    ).toBeInTheDocument();
    expect(within(sobreMiSeccion).queryByText("Texto de métodos.")).not.toBeInTheDocument();
    const tarjetas = within(sobreMiSeccion).getAllByRole("listitem");
    expect(tarjetas).toHaveLength(3);
    expect(tarjetas[0].className).toContain("rounded-card");
    expect(tarjetas[0].className).toContain("bg-surface");
    for (const tarjeta of tarjetas) {
      expect(tarjeta.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
    }
    const texto = sobreMiSeccion.textContent!;
    expect(texto.indexOf("Texto de forma.")).toBeLessThan(texto.indexOf("Entrevistas"));
    expect(
      within(sobreMiSeccion).queryByRole("heading", { name: "Trayectoria" }),
    ).not.toBeInTheDocument();
  });

  it("Sobre mí incluye la experiencia cuando el perfil tiene entradas", () => {
    enRuta(
      <HomePage
        profile={{
          ...perfil,
          career: {
            experience: [{ title: "UX Lead B2B", organization: "Magneto 365", from: "2025-09" }],
          },
        }}
        cvAvailable
        cases={casos}
        meta={meta}
        about={sobreMi}
        contactCall="Escríbeme para colaborar."
      />,
    );

    const sobreMiSeccion = document.getElementById("sobre-mi")!;
    expect(
      within(sobreMiSeccion).getByRole("heading", { level: 3, name: "Experiencia" }),
    ).toBeInTheDocument();
    expect(within(sobreMiSeccion).getByText("Magneto 365")).toBeInTheDocument();
  });

  it("Contacto tiene el llamado y solo enlaces: correo, LinkedIn y CV", () => {
    pagina();

    const contacto = document.getElementById("contacto")!;
    expect(within(contacto).getByText("Escríbeme para colaborar.")).toBeInTheDocument();
    const lista = within(contacto).getByRole("list", { name: "Contacto" });
    expect(within(lista).getAllByRole("link")).toHaveLength(3);
    expect(within(lista).getByRole("link", { name: "Email" })).toHaveAttribute(
      "href",
      `mailto:${perfil.email}`,
    );
    expect(within(lista).getByRole("link", { name: /CV/ })).toHaveAttribute("download");
    expect(within(contacto).getByText("03 / Contacto")).toBeInTheDocument();
    expect(
      within(contacto).getByRole("heading", { level: 2, name: "Hagamos un buen producto." }),
    ).toBeInTheDocument();
    expect(contacto.querySelector("form, input, textarea")).toBeNull();
  });

  it("los botones de la intro llevan a Trabajos y al correo", () => {
    pagina();

    expect(screen.getByRole("link", { name: "Ver mis trabajos" })).toHaveAttribute(
      "href",
      "/#trabajos",
    );
    expect(screen.getByRole("link", { name: "Escríbeme" })).toHaveAttribute(
      "href",
      `mailto:${perfil.email}`,
    );
  });

  it("incluye los elementos globales", () => {
    pagina();
    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  });

  it("en inglés usa sus textos y sus direcciones", () => {
    pagina("/en/");

    expect(screen.getByRole("heading", { level: 2, name: "Less friction. More impact." })).toBeInTheDocument();
    expect(screen.getByText("01 / Work")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: "From problem to system." }),
    ).toBeInTheDocument();
    expect(screen.getByText(/Interviews, usability audits/)).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: /Visual sensibility/ })).not.toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: "Let's make a good product." }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "See my work" })).toHaveAttribute(
      "href",
      "/en/#trabajos",
    );
    expect(screen.getByRole("link", { name: "Email me" })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: `Photo of ${perfil.name}` })).toBeInTheDocument();
    expect(screen.getByText("years designing product")).toBeInTheDocument();
    expect(screen.getByText("published product cases")).toBeInTheDocument();
    expect(screen.getByText("less drop-off in the dispatch flow")).toBeInTheDocument();
    const tarjetas = within(document.getElementById("trabajos")!).getAllByRole("listitem");
    expect(within(tarjetas[0]).getByRole("link")).toHaveAttribute("href", "/en/work/pagos/");
    expect(within(tarjetas[3]).getByRole("link")).toHaveAttribute(
      "href",
      "/en/work/this-portfolio/",
    );
  });

  it("no tiene violaciones de accesibilidad", async () => {
    const { container } = pagina();
    expect(await axe(container)).toHaveNoViolations();
  });

  it("no tiene violaciones de accesibilidad en inglés", async () => {
    const { container } = pagina("/en/");
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("NotFoundPage (contracts/routes.md)", () => {
  it("tiene un solo h1 con los dos idiomas y un enlace al inicio de cada uno", () => {
    enRuta(<NotFoundPage />, "/no-existe");

    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Página no encontrada · Page not found",
    );
    expect(screen.getByText("Page not found")).toHaveAttribute("lang", "en");
    expect(screen.getByRole("link", { name: "Volver al inicio" })).toHaveAttribute("href", "/");
    const english = screen.getByRole("link", { name: "Back to home" });
    expect(english).toHaveAttribute("href", "/en/");
    expect(english).toHaveAttribute("lang", "en");
    expect(english).toHaveAttribute("hreflang", "en");
    expect(screen.getByRole("main")).toHaveAttribute("id", "contenido");
  });

  it("no tiene violaciones de accesibilidad", async () => {
    const { container } = enRuta(<NotFoundPage />, "/no-existe");
    expect(await axe(container)).toHaveNoViolations();
  });
});
