import { render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { axe } from "vitest-axe";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Figure } from "~/components/atoms/Figure";
import { Heading } from "~/components/atoms/Heading";
import { Text } from "~/components/atoms/Text";
import { CaseCard } from "~/components/molecules/CaseCard";
import { CaseSummary } from "~/components/molecules/CaseSummary";
import { SectionIndex } from "~/components/molecules/SectionIndex";
import { CaseBody } from "~/components/organisms/CaseBody";
import { CaseIndex } from "~/components/organisms/CaseIndex";
import { CasePage } from "~/components/pages/CasePage";
import { CaseTemplate } from "~/components/templates/CaseTemplate";
import type { CaseStudy } from "~/content/schema";

function enRuta(ui: React.ReactElement) {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
}

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

const markdown = `## 1. Problema inicial

*Tensión: ¿por qué esto importaba?*

**Contexto de negocio:** La empresa es una plataforma SaaS de logística.

**Decisiones clave:**

- Unificar los dos flujos, porque eliminaba la copia de datos.

> «Siempre termino copiando el número en un bloc de notas.»

![Gráfico de barras del abandono por paso](/figuras/figura-1.png "Figura 1. Abandono por paso")

Más detalle en [la guía](https://ejemplo.com/guia).

## 2. Investigación y datos de usuario

Texto de la segunda sección.

### Hallazgos

Un subtema.

## 3. Arquitectura de la solución

Texto.

## 4. Resultados y aprendizajes

Texto.
`;

describe("Heading", () => {
  it("usa el nivel semántico y un tamaño de la escala", () => {
    render(<Heading level={2}>Título</Heading>);
    const h = screen.getByRole("heading", { level: 2, name: "Título" });
    expect(h.className).toContain("text-2xl");
  });

  it("permite un tamaño distinto del nivel y un id", () => {
    render(
      <Heading level={2} size="xl" id="resumen">
        Resumen
      </Heading>,
    );
    const h = screen.getByRole("heading", { level: 2, name: "Resumen" });
    expect(h.className).toContain("text-xl");
    expect(h).toHaveAttribute("id", "resumen");
  });
});

describe("Text", () => {
  it("es un párrafo y admite tono atenuado", () => {
    render(<Text tone="muted">Apoyo</Text>);
    const p = screen.getByText("Apoyo");
    expect(p.tagName).toBe("P");
    expect(p.className).toContain("text-text-muted");
  });
});

describe("Figure", () => {
  it("muestra la imagen con su texto alternativo, el pie y las dimensiones declaradas", () => {
    render(<Figure src="/f.png" alt="Diagrama del flujo" caption="Figura 1. Flujo" />);
    const img = screen.getByRole("img", { name: "Diagrama del flujo" });
    expect(img).toHaveAttribute("src", "/f.png");
    expect(img).toHaveAttribute("loading", "lazy");
    expect(screen.getByText("Figura 1. Flujo").tagName).toBe("FIGCAPTION");
  });

  it("no acepta una imagen sin texto alternativo", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<Figure src="/f.png" alt="  " caption="Pie" />)).toThrow(/alt/);
  });

  it("no tiene violaciones de accesibilidad", async () => {
    const { container } = render(<Figure src="/f.png" alt="Diagrama" caption="Pie" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("CaseSummary (FR-020, FR-035)", () => {
  const labels = {
    title: "Resumen en 30 segundos",
    product: "Producto",
    role: "Mi rol",
    team: "Equipo",
    duration: "Duración",
    keyResult: "Resultado clave",
  };
  const summary = {
    product: "Plataforma B2B de despachos",
    role: "Product Designer líder",
    team: "1 PM, 4 desarrolladores",
    duration: "6 meses",
    keyResult: "Entre 20% y 30% menos abandono",
  };

  it("presenta el resumen como lista de definiciones dentro de una tarjeta con borde", () => {
    const { container } = render(<CaseSummary summary={summary} labels={labels} />);

    expect(screen.getByRole("heading", { level: 2, name: labels.title })).toBeInTheDocument();
    const dl = container.querySelector("dl")!;
    const clases = dl.className.split(/\s+/);
    for (const esperada of ["border", "rounded-card", "bg-surface-tonal", "sm:grid-cols-2"]) {
      expect(clases).toContain(esperada);
    }
    const terms = [...dl.querySelectorAll("dt")].map((dt) => dt.textContent);
    expect(terms).toEqual(["Producto", "Mi rol", "Equipo", "Duración", "Resultado clave"]);
    expect(within(dl).getByText(summary.keyResult)).toBeInTheDocument();
  });

  it("destaca el resultado clave a todo el ancho de la tarjeta", () => {
    const { container } = render(<CaseSummary summary={summary} labels={labels} />);
    const keyResult = screen.getByText("Resultado clave").parentElement!;
    expect(keyResult.className).toContain("sm:col-span-2");
    expect(container.querySelector("dd.text-lg")?.textContent).toBe(summary.keyResult);
  });

  it("omite el equipo si el caso no lo tiene (caso meta)", () => {
    render(<CaseSummary summary={{ ...summary, team: undefined }} labels={labels} />);
    expect(screen.queryByText("Equipo")).not.toBeInTheDocument();
  });

  it("no tiene violaciones de accesibilidad", async () => {
    const { container } = render(<CaseSummary summary={summary} labels={labels} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("SectionIndex (FR-035)", () => {
  const items = [
    { id: "problema-inicial", title: "Problema inicial", number: 1 },
    { id: "investigacion", title: "Investigación", number: 2 },
  ];

  it("lista las secciones numeradas con enlaces ancla dentro de una navegación con nombre", () => {
    render(<SectionIndex label="En este caso" items={items} />);

    const nav = screen.getByRole("navigation", { name: "En este caso" });
    const links = within(nav).getAllByRole("link");
    expect(links.map((a) => a.textContent)).toEqual(["1. Problema inicial", "2. Investigación"]);
    expect(links.map((a) => a.getAttribute("href"))).toEqual([
      "#problema-inicial",
      "#investigacion",
    ]);
  });

  it("no tiene violaciones de accesibilidad", async () => {
    const { container } = render(<SectionIndex label="En este caso" items={items} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("CaseCard (FR-019)", () => {
  const props = {
    to: "/trabajos/despacho",
    title: "Rediseño del flujo de despacho",
    sector: "Fintech",
    sectorLabel: "Rubro",
    role: "Product Designer líder",
    description: "Entre 20% y 30% menos abandono.",
    readLabel: "Leer el caso",
  };

  it("muestra rubro, título, rol y resultado, con un enlace de texto descriptivo", () => {
    enRuta(<CaseCard {...props} />);

    expect(screen.getByRole("heading", { level: 3, name: props.title })).toBeInTheDocument();
    expect(screen.getByText("Fintech")).toBeInTheDocument();
    expect(screen.getByText(props.role)).toBeInTheDocument();
    expect(screen.getByText(props.description)).toBeInTheDocument();
    const link = screen.getByRole("link", { name: `Leer el caso: ${props.title}` });
    expect(link).toHaveAttribute("href", "/trabajos/despacho");
  });

  it("es una tarjeta tonal: fondo con tinte, esquinas de 16px y borde de 1px", () => {
    const { container } = enRuta(
      <ul>
        <CaseCard {...props} />
      </ul>,
    );
    const clases = container.querySelector("li")!.className.split(/\s+/);

    for (const esperada of ["bg-surface-tonal", "rounded-card", "border", "border-border"]) {
      expect(clases).toContain(esperada);
    }
    expect(clases).not.toContain("bg-surface");
  });

  it("recorta la imagen con la esquina de la tarjeta y la pone primero, a todo el ancho", () => {
    const { container } = enRuta(
      <ul>
        <CaseCard {...props} />
      </ul>,
    );
    const tarjeta = container.querySelector("li")!;
    const imagen = tarjeta.firstElementChild!;

    expect(tarjeta.className.split(/\s+/)).toContain("overflow-hidden");
    expect(tarjeta.className.split(/\s+/)).not.toContain("p-4");
    expect(imagen.tagName).toBe("IMG");
    for (const esperada of ["aspect-video", "w-full", "object-cover"]) {
      expect(imagen.className.split(/\s+/)).toContain(esperada);
    }
  });

  it("usa una imagen genérica y decorativa hasta que el caso tenga la suya", () => {
    const { container } = enRuta(
      <ul>
        <CaseCard {...props} />
      </ul>,
    );
    const imagen = container.querySelector("img")!;

    expect(imagen).toHaveAttribute("src", "/casos/generica.svg");
    expect(imagen).toHaveAttribute("alt", "");
  });

  it("acepta la imagen propia del caso con su texto alternativo", () => {
    const { container } = enRuta(
      <ul>
        <CaseCard {...props} image={{ src: "/casos/despacho.jpg", alt: "Pantalla de despacho" }} />
      </ul>,
    );
    const imagen = container.querySelector("img")!;

    expect(imagen).toHaveAttribute("src", "/casos/despacho.jpg");
    expect(imagen).toHaveAttribute("alt", "Pantalla de despacho");
  });

  it("el rubro es un chip de solo lectura con su etiqueta para tecnología de apoyo", () => {
    const { container } = enRuta(
      <ul>
        <CaseCard {...props} />
      </ul>,
    );
    const chip = screen.getByText("Fintech").closest("p")!;

    expect(chip.textContent).toBe("Rubro: Fintech");
    expect(chip.querySelector(".sr-only")?.textContent).toBe("Rubro: ");
    for (const esperada of ["rounded-chip", "border", "border-border", "text-sm", "self-start"]) {
      expect(chip.className.split(/\s+/)).toContain(esperada);
    }
    expect(chip.closest("a, button")).toBeNull();
    expect(container.querySelectorAll("a")).toHaveLength(1);
  });

  it("el chip va entre la imagen y el título", () => {
    const { container } = enRuta(
      <ul>
        <CaseCard {...props} />
      </ul>,
    );
    const texto = container.querySelector("li")!.textContent!;

    expect(texto.indexOf("Fintech")).toBeLessThan(texto.indexOf(props.title));
  });

  it("no muestra rol si el caso no lo tiene", () => {
    enRuta(<CaseCard {...props} role={undefined} />);
    expect(screen.queryByText(props.role)).not.toBeInTheDocument();
  });

  it("no tiene violaciones de accesibilidad", async () => {
    const { container } = enRuta(
      <ul>
        <CaseCard {...props} />
      </ul>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("CaseBody", () => {
  it("numera las secciones, les da id y las agrupa en regiones con nombre", () => {
    const { container } = enRuta(<CaseBody markdown={markdown} />);

    const h2 = screen.getByRole("heading", { level: 2, name: "1. Problema inicial" });
    expect(h2).toHaveAttribute("id", "titulo-problema-inicial");
    const seccion = container.querySelector("section#problema-inicial")!;
    expect(seccion).toHaveAttribute("aria-labelledby", "titulo-problema-inicial");
    expect(container.querySelectorAll("section")).toHaveLength(4);
    expect(
      screen.getByRole("heading", { level: 2, name: "2. Investigación y datos de usuario" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3, name: "Hallazgos" })).toBeInTheDocument();
  });

  it("nunca crea un segundo h1", () => {
    enRuta(<CaseBody markdown={"# Intruso\n\n## Uno\n\nTexto"} />);
    expect(screen.queryByRole("heading", { level: 1 })).not.toBeInTheDocument();
  });

  it("muestra las etiquetas en negrita encima del texto y atenúa la línea de tensión", () => {
    enRuta(<CaseBody markdown={markdown} />);

    const etiqueta = screen.getByText("Contexto de negocio");
    expect(etiqueta.tagName).toBe("STRONG");
    expect(etiqueta.className).toContain("block");
    expect(etiqueta.parentElement).toHaveTextContent("La empresa es una plataforma SaaS");
    expect(screen.getByText(/Tensión/).className).toContain("text-text-muted");
  });

  it("renderiza listas, citas y enlaces con los componentes del sistema", () => {
    enRuta(<CaseBody markdown={markdown} />);

    expect(screen.getByRole("list")).toBeInTheDocument();
    expect(screen.getByText(/Siempre termino copiando/).closest("blockquote")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "la guía" })).toHaveAttribute(
      "href",
      "https://ejemplo.com/guia",
    );
  });

  it("convierte una imagen en una figura con pie, fuera de un párrafo y a todo el ancho", () => {
    enRuta(<CaseBody markdown={markdown} />);

    const img = screen.getByRole("img", { name: "Gráfico de barras del abandono por paso" });
    expect(img.closest("p")).toBeNull();
    const figure = img.closest("figure")!;
    expect(within(figure).getByText("Figura 1. Abandono por paso")).toBeInTheDocument();
    expect(figure.className).not.toContain("max-w-prose");
  });

  it("limita el texto a unos 65 caracteres por línea (FR-035)", () => {
    enRuta(<CaseBody markdown={markdown} />);
    expect(screen.getByText("Texto de la segunda sección.").className).toContain("max-w-prose");
  });

  it("deja el texto legible aunque la imagen falle: el alt y el pie están en el DOM (FR-016)", () => {
    enRuta(<CaseBody markdown={markdown} />);
    expect(screen.getByAltText("Gráfico de barras del abandono por paso")).toBeInTheDocument();
    expect(screen.getByText("Figura 1. Abandono por paso")).toBeVisible();
  });

  it("no tiene violaciones de accesibilidad", async () => {
    const { container } = enRuta(<CaseBody markdown={markdown} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("CaseIndex (FR-019)", () => {
  const sectores = ["Fintech", "ATS", "Research", "Design system"];
  // El caso meta es una tarjeta más: el cuarto proyecto.
  const casos = sectores.map((sector, indice) => ({
    to: `/trabajos/caso-${indice + 1}`,
    title: `Caso ${indice + 1}`,
    sector,
    sectorLabel: "Rubro",
    role: indice === 3 ? undefined : "Product Designer",
    description: `Resultado ${indice + 1}.`,
    readLabel: "Leer el caso",
  }));

  it("lista los cuatro casos como tarjetas iguales en una cuadrícula de dos columnas", () => {
    enRuta(<CaseIndex cases={casos} />);

    const lista = screen.getByRole("list");
    const tarjetas = within(lista).getAllByRole("listitem");
    expect(tarjetas).toHaveLength(4);
    expect(lista.className.split(/\s+/)).toContain("sm:grid-cols-2");
    for (const tarjeta of tarjetas) {
      expect(tarjeta.className).toContain("overflow-hidden");
      expect(tarjeta.querySelector("img")).not.toBeNull();
    }
  });

  it("cada tarjeta lleva el chip de su rubro", () => {
    enRuta(<CaseIndex cases={casos} />);

    for (const sector of sectores) {
      expect(screen.getByText(sector).closest("p")!.textContent).toBe(`Rubro: ${sector}`);
    }
  });

  it("ya no hay una tarjeta destacada aparte", () => {
    const { container } = enRuta(<CaseIndex cases={casos} />);

    expect(container.querySelectorAll("ul")).toHaveLength(1);
    expect(container.querySelectorAll("li")).toHaveLength(4);
    expect(container.innerHTML).not.toContain("border-border-strong");
  });

  it("no tiene violaciones de accesibilidad", async () => {
    const { container } = enRuta(<CaseIndex cases={casos} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("CaseTemplate (FR-035)", () => {
  it("pone el enlace de volver antes del título y no repite el enlace al final", () => {
    enRuta(
      <CaseTemplate
        backHref="/#trabajos"
        backLabel="Volver a Trabajos"
        eyebrow="Caso de producto · B2B SaaS"
        title="Un caso"
        summary={<p>Resumen</p>}
        index={<p>Índice</p>}
      >
        <p>Cuerpo</p>
      </CaseTemplate>,
    );

    const back = screen.getByRole("link", { name: /Volver a Trabajos/ });
    const h1 = screen.getByRole("heading", { level: 1, name: "Un caso" });
    expect(back).toHaveAttribute("href", "/#trabajos");
    expect(back.compareDocumentPosition(h1) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(screen.getAllByRole("link", { name: /Volver a Trabajos/ })).toHaveLength(1);
  });

  it("ordena: volver, título, resumen, índice y cuerpo", () => {
    enRuta(
      <CaseTemplate
        backHref="/#trabajos"
        backLabel="Volver"
        eyebrow="Tipo"
        title="Título"
        summary={<p>RESUMEN</p>}
        index={<p>INDICE</p>}
      >
        <p>CUERPO</p>
      </CaseTemplate>,
    );
    const texto = document.body.textContent ?? "";
    expect(texto.indexOf("Título")).toBeLessThan(texto.indexOf("RESUMEN"));
    expect(texto.indexOf("RESUMEN")).toBeLessThan(texto.indexOf("INDICE"));
    expect(texto.indexOf("INDICE")).toBeLessThan(texto.indexOf("CUERPO"));
  });
});

describe("CasePage", () => {
  const perfil = {
    name: "Nombre Apellido",
    email: "nombre@ejemplo.com",
    linkedin: "https://www.linkedin.com/in/ejemplo",
    cv: "/cv.pdf",
  };
  const labels = {
    back: "Volver a Trabajos",
    eyebrowProduct: "Caso de producto",
    eyebrowMeta: "Caso de este portafolio",
    index: "En este caso",
    summary: {
      title: "Resumen en 30 segundos",
      product: "Producto",
      role: "Mi rol",
      team: "Equipo",
      duration: "Duración",
      keyResult: "Resultado clave",
    },
  };
  const caso: CaseStudy = {
    slug: "despacho",
    type: "product",
    status: "published",
    order: 1,
    title: "Rediseño del flujo de despacho",
    seo: { title: "Despacho", description: "Un caso de rediseño del flujo de despacho de carga." },
    summary: {
      product: "Plataforma B2B",
      role: "Product Designer líder",
      team: "1 PM, 4 dev",
      duration: "6 meses",
      keyResult: "Entre 20% y 30% menos abandono",
      indexLine: "Menos abandono.",
      productType: "B2B SaaS",
    },
    body: markdown,
  };

  function pagina(c: CaseStudy = caso) {
    return enRuta(<CasePage profile={perfil} cvAvailable caseStudy={c} labels={labels} />);
  }

  it("compone el caso: volver, un solo h1, resumen, índice de cuatro secciones y cuerpo", () => {
    pagina();

    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(caso.title);
    expect(screen.getByText("Caso de producto · B2B SaaS")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Volver a Trabajos/ })).toHaveAttribute(
      "href",
      "/#trabajos",
    );
    const indice = screen.getByRole("navigation", { name: "En este caso" });
    expect(within(indice).getAllByRole("link")).toHaveLength(4);
    expect(screen.getByRole("heading", { name: "Resumen en 30 segundos" })).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: "1. Problema inicial" }),
    ).toBeInTheDocument();
  });

  it("el índice enlaza a los mismos id que tiene el cuerpo", () => {
    const { container } = pagina();
    const indice = screen.getByRole("navigation", { name: "En este caso" });
    for (const link of within(indice).getAllByRole("link")) {
      const id = link.getAttribute("href")!.slice(1);
      expect(container.querySelector(`section#${id}`)).not.toBeNull();
    }
  });

  it("el caso meta no muestra equipo y usa su propia etiqueta de tipo", () => {
    const resumenMeta = {
      ...caso.summary,
      team: undefined,
      indexLine: undefined,
      productType: undefined,
    };
    pagina({ ...caso, type: "meta", summary: resumenMeta });

    expect(screen.queryByText("Equipo")).not.toBeInTheDocument();
    expect(screen.getByText("Caso de este portafolio")).toBeInTheDocument();
  });

  it("incluye los elementos globales", () => {
    pagina();
    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByRole("main")).toBeInTheDocument();
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  });

  it("no tiene violaciones de accesibilidad", async () => {
    const { container } = pagina();
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("CasePage en inglés (FR-042)", () => {
  const caso: CaseStudy = {
    slug: "analytics",
    type: "product",
    status: "published",
    order: 1,
    title: "Analytics redesign",
    seo: {
      title: "Analytics",
      description: "A case study about redesigning an analytics product.",
    },
    summary: {
      product: "B2B platform",
      role: "Lead Product Designer",
      team: "1 PM, 4 devs",
      duration: "6 months",
      keyResult: "20% less abandonment",
      productType: "B2B SaaS",
    },
    body: "## 1. Initial problem\n\nText.\n\n## 2. Research\n\nText.\n\n## 3. Solution architecture\n\nText.\n\n## 4. Results and learnings\n\nText.\n",
  };
  const perfil = {
    name: "Nombre Apellido",
    email: "nombre@ejemplo.com",
    linkedin: "https://www.linkedin.com/in/ejemplo",
    cv: "/cv.pdf",
  };

  function pagina() {
    return render(
      <MemoryRouter initialEntries={["/en/work/analytics/"]}>
        <CasePage profile={perfil} cvAvailable caseStudy={caso} />
      </MemoryRouter>,
    );
  }

  it("usa los textos del idioma de la ruta sin que se los pasen", () => {
    pagina();

    expect(screen.getByRole("link", { name: /Back to Work/ })).toHaveAttribute(
      "href",
      "/en/#trabajos",
    );
    expect(screen.getByText("Product case · B2B SaaS")).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: "In this case" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "30-second summary" })).toBeInTheDocument();
    expect(screen.getByText("Key result")).toBeInTheDocument();
  });

  it("el selector de idioma lleva al mismo caso en español", () => {
    render(
      <MemoryRouter initialEntries={["/en/work/analytics/"]}>
        <CasePage
          profile={perfil}
          cvAvailable
          caseStudy={caso}
          casePairs={[
            { file: "caso-01.md", type: "product", slugs: { es: "analitica", en: "analytics" } },
          ]}
        />
      </MemoryRouter>,
    );

    expect(screen.getByRole("link", { name: "ES Español" })).toHaveAttribute(
      "href",
      "/trabajos/analitica/",
    );
  });

  it("no tiene violaciones de accesibilidad", async () => {
    const { container } = pagina();
    expect(await axe(container)).toHaveNoViolations();
  });
});
