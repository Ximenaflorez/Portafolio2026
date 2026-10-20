import { render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { axe } from "vitest-axe";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Figure } from "~/components/atoms/Figure";
import { Heading } from "~/components/atoms/Heading";
import { Text } from "~/components/atoms/Text";
import { CaseCard } from "~/components/molecules/CaseCard";
import { CaseSummary } from "~/components/molecules/CaseSummary";
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
    kind: "Tipo",
  };
  const summary = {
    product: "Plataforma B2B de despachos",
    role: "Product Designer líder",
    team: "1 PM, 4 desarrolladores",
    duration: "6 meses",
    keyResult: "Entre 20% y 30% menos abandono",
  };

  it("abre con el producto y una fila de datos; el resultado clave ocupa todo el ancho", () => {
    const { container } = render(<CaseSummary summary={summary} labels={labels} />);

    expect(screen.getByRole("heading", { level: 2, name: labels.title })).toBeInTheDocument();
    expect(screen.getByText(summary.product).tagName).toBe("P");
    const dl = container.querySelector("dl")!;
    const clases = dl.className.split(/\s+/);
    for (const esperada of ["border-t", "grid-cols-2", "lg:grid-cols-4"]) {
      expect(clases).toContain(esperada);
    }
    const terms = [...dl.querySelectorAll("dt")].map((dt) => dt.textContent);
    expect(terms).toEqual(["Mi rol", "Equipo", "Duración"]);
    const banner = screen.getByText(summary.keyResult).closest("div")!;
    expect(banner.className).toContain("bg-primary");
    expect(banner.className).toContain("text-on-primary");
    expect(screen.getByText("Resultado clave")).toBeInTheDocument();
    expect(screen.getByText("· Resumen en 30 segundos")).toBeInTheDocument();
  });

  it("muestra el tipo de trabajo cuando el caso lo trae", () => {
    render(
      <CaseSummary summary={{ ...summary, kind: "Investigación de viabilidad" }} labels={labels} />,
    );
    expect(screen.getByText("Tipo")).toBeInTheDocument();
    expect(screen.getByText("Investigación de viabilidad")).toBeInTheDocument();
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

  it("recorta la imagen con la esquina de la tarjeta: abajo en teléfono y a la derecha desde `sm`", () => {
    const { container } = enRuta(
      <ul>
        <CaseCard {...props} />
      </ul>,
    );
    const tarjeta = container.querySelector("li")!;
    const imagen = tarjeta.lastElementChild!;
    const clases = tarjeta.className.split(/\s+/);

    expect(clases).toContain("overflow-hidden");
    expect(clases).toContain("flex-col");
    expect(clases).toContain("sm:flex-row");
    expect(clases).not.toContain("p-4");
    expect(imagen.tagName).toBe("IMG");
    for (const esperada of ["aspect-video", "w-full", "object-cover", "sm:w-1/2"]) {
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

  it("muestra los chips extra junto al rubro, antes del título", () => {
    const { container } = enRuta(
      <ul>
        <CaseCard {...props} tags={["Investigación"]} />
      </ul>,
    );
    const extra = screen.getByText("Investigación").closest("p")!;

    expect(extra.textContent).toBe("Investigación");
    expect(extra.closest("a, button")).toBeNull();
    for (const esperada of ["rounded-chip", "border", "border-border", "text-sm"]) {
      expect(extra.className.split(/\s+/)).toContain(esperada);
    }
    const texto = container.querySelector("li")!.textContent!;
    expect(texto.indexOf("Investigación")).toBeLessThan(texto.indexOf(props.title));
  });

  it("el rubro va antes del título", () => {
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

    const h2 = screen.getByRole("heading", { level: 2, name: "Problema inicial" });
    expect(h2).toHaveAttribute("id", "titulo-problema-inicial");
    const seccion = container.querySelector("section#problema-inicial")!;
    expect(seccion).toHaveAttribute("aria-labelledby", "titulo-problema-inicial");
    expect(container.querySelectorAll("section")).toHaveLength(4);
    expect(
      screen.getByRole("heading", { level: 2, name: "Investigación y datos de usuario" }),
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
    const pregunta = screen.getByText(/Tensión/);
    expect(pregunta.textContent).toMatch(/^01 · /);
    expect(pregunta.className).toContain("text-primary");
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

  it("agrupa los porcentajes en cifras grandes y las modalidades en tarjetas", () => {
    enRuta(
      <CaseBody
        markdown={`## Datos

- **31,5 %** del presupuesto
- **20 %** con crédito

## Solución

- **Apuntado digital:** $10.000 – $100.000
- **Fiado electrónico:** $150.000 – $1.000.000
`}
      />,
    );

    const cifra = screen.getByText("31,5 %");
    expect(cifra.tagName).toBe("STRONG");
    expect(cifra.className).toContain("text-3xl");
    expect(cifra.closest("ul")!.className).toContain("sm:grid-cols-3");

    const modalidad = screen.getByText("Apuntado digital");
    expect(modalidad.closest("li")!.className).toContain("rounded-card");
    expect(modalidad.closest("ul")!.className).toContain("sm:grid-cols-2");
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

  it("lista los cuatro casos como tarjetas iguales a todo el ancho", () => {
    enRuta(<CaseIndex cases={casos} emptyLabel="Aún no hay casos publicados." />);

    const lista = screen.getByRole("list");
    const tarjetas = within(lista).getAllByRole("listitem");
    expect(tarjetas).toHaveLength(4);
    expect(lista.className.split(/\s+/)).toContain("flex-col");
    expect(lista.className.split(/\s+/)).not.toContain("sm:grid-cols-2");
    for (const tarjeta of tarjetas) {
      expect(tarjeta.className).toContain("overflow-hidden");
      expect(tarjeta.className).toContain("sm:flex-row");
      expect(tarjeta.querySelector("img")).not.toBeNull();
    }
  });

  it("cada tarjeta lleva el rubro", () => {
    enRuta(<CaseIndex cases={casos} emptyLabel="Aún no hay casos publicados." />);

    for (const sector of sectores) {
      expect(screen.getByText(sector).closest("p")!.textContent).toBe(`Rubro: ${sector}`);
    }
  });

  it("ya no hay una tarjeta destacada aparte", () => {
    const { container } = enRuta(
      <CaseIndex cases={casos} emptyLabel="Aún no hay casos publicados." />,
    );

    expect(container.querySelectorAll("ul")).toHaveLength(1);
    expect(container.querySelectorAll("li")).toHaveLength(4);
    expect(container.innerHTML).not.toContain("border-border-strong");
  });

  it("no tiene violaciones de accesibilidad", async () => {
    const { container } = enRuta(
      <CaseIndex cases={casos} emptyLabel="Aún no hay casos publicados." />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("sin casos explica que todavía no hay, y no deja una lista vacía", () => {
    enRuta(<CaseIndex cases={[]} emptyLabel="Aún no hay casos publicados." />);

    expect(screen.getByText("Aún no hay casos publicados.")).toBeInTheDocument();
    expect(screen.queryByRole("list")).not.toBeInTheDocument();
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

  it("ordena: volver, título, resumen y cuerpo", () => {
    enRuta(
      <CaseTemplate
        backHref="/#trabajos"
        backLabel="Volver"
        eyebrow="Tipo"
        title="Título"
        summary={<p>RESUMEN</p>}
      >
        <p>CUERPO</p>
      </CaseTemplate>,
    );
    const texto = document.body.textContent ?? "";
    expect(texto.indexOf("Volver")).toBeLessThan(texto.indexOf("Título"));
    expect(texto.indexOf("Título")).toBeLessThan(texto.indexOf("RESUMEN"));
    expect(texto.indexOf("RESUMEN")).toBeLessThan(texto.indexOf("CUERPO"));
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
    summary: {
      title: "Resumen en 30 segundos",
      product: "Producto",
      role: "Mi rol",
      team: "Equipo",
      duration: "Duración",
      keyResult: "Resultado clave",
      kind: "Tipo",
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

  it("compone el caso: volver, un solo h1, resumen y cuerpo, sin índice de secciones", () => {
    pagina();

    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(caso.title);
    expect(screen.getByText("Caso de producto · B2B SaaS")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Volver a Trabajos/ })).toHaveAttribute(
      "href",
      "/#trabajos",
    );
    expect(screen.queryByRole("navigation", { name: "En este caso" })).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Resumen en 30 segundos" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "Problema inicial" })).toBeInTheDocument();
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
    expect(screen.queryByRole("navigation", { name: "In this case" })).not.toBeInTheDocument();
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
