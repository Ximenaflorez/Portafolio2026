import { render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { axe } from "vitest-axe";
import { describe, expect, it } from "vitest";
import { Career } from "~/components/organisms/Career";
import type { Career as CareerData } from "~/content/schema";

const career: CareerData = {
  experience: [
    {
      title: "UX Lead B2B",
      organization: "Magneto Empleos",
      from: "2025-09",
      summary: "Definí la estrategia de UX B2B.",
      tools: ["Figma", "Maze"],
    },
    {
      title: "Diseñadora UX",
      organization: "Sistecrédito",
      from: "2022-10",
      to: "2024-07",
      tools: ["Figma"],
    },
  ],
  education: [
    { title: "Pregrado en Artes Visuales", organization: "Universidad de Antioquia", from: "2017" },
  ],
  certificates: [
    {
      title: "Google Analytics",
      organization: "Google Skillshop",
      from: "2025-02",
      credentialUrl: "https://skillshop.example.com/a",
    },
    {
      title: "Google Ads",
      organization: "Coderhouse",
      from: "2025-02",
      credentialUrl: "https://skillshop.example.com/b",
    },
  ],
};

function enRuta(data: CareerData = career, ruta = "/") {
  return render(
    <MemoryRouter initialEntries={[ruta]}>
      <Career career={data} />
    </MemoryRouter>,
  );
}

describe("Career (FR-044)", () => {
  it("tiene el encabezado «Trayectoria» y cada grupo es una lista con su encabezado", () => {
    enRuta();

    expect(screen.getByRole("heading", { level: 3, name: "Trayectoria" })).toBeInTheDocument();
    for (const [grupo, entradas] of [
      ["Experiencia", 2],
      ["Educación", 1],
      ["Certificados", 2],
    ] as const) {
      expect(screen.getByRole("heading", { level: 4, name: grupo })).toBeInTheDocument();
      const lista = screen.getByRole("list", { name: grupo });
      expect(lista.children).toHaveLength(entradas);
    }
  });

  it("cada experiencia muestra rol, empresa real, fechas con <time> y su logro", () => {
    enRuta();

    const lista = screen.getByRole("list", { name: "Experiencia" });
    const [actual, anterior] = Array.from(lista.children) as HTMLElement[];
    expect(within(actual).getByText("UX Lead B2B")).toBeInTheDocument();
    expect(within(actual).getByText("Magneto Empleos")).toBeInTheDocument();
    expect(within(actual).getByText("Definí la estrategia de UX B2B.")).toBeInTheDocument();
    expect(actual.querySelector("time")).toHaveAttribute("datetime", "2025-09");
    expect(actual).toHaveTextContent("sep 2025 – Actualidad");

    const fechas = Array.from(anterior.querySelectorAll("time")).map((t) =>
      t.getAttribute("datetime"),
    );
    expect(fechas).toEqual(["2022-10", "2024-07"]);
    expect(anterior).toHaveTextContent("oct 2022 – jul 2024");
  });

  it("las herramientas son una lista con nombre propio, de solo lectura", () => {
    enRuta();

    const herramientas = screen.getByRole("list", { name: "Herramientas: UX Lead B2B" });
    expect(within(herramientas).getAllByRole("listitem").map((li) => li.textContent)).toEqual([
      "Figma",
      "Maze",
    ]);
    for (const chip of within(herramientas).getAllByRole("listitem")) {
      expect(chip.className).toContain("rounded-chip");
      expect(chip.className).toContain("border");
      expect(chip).not.toHaveAttribute("tabindex");
      expect(within(chip).queryByRole("button")).not.toBeInTheDocument();
    }
    expect(screen.getByRole("list", { name: "Herramientas: Diseñadora UX" })).toBeInTheDocument();
  });

  it("la educación muestra título, institución y año", () => {
    enRuta();

    const entrada = screen.getByRole("list", { name: "Educación" }).children[0] as HTMLElement;
    expect(entrada).toHaveTextContent("Pregrado en Artes Visuales");
    expect(entrada).toHaveTextContent("Universidad de Antioquia");
    expect(entrada.querySelector("time")).toHaveAttribute("datetime", "2017");
  });

  it("cada enlace a la credencial tiene un nombre accesible único", () => {
    enRuta();

    const enlaces = screen.getAllByRole("link", { name: /Ver credencial/ });
    expect(enlaces.map((a) => a.textContent)).toEqual([
      "Ver credencial: Google Analytics",
      "Ver credencial: Google Ads",
    ]);
    expect(enlaces[0]).toHaveAttribute("href", "https://skillshop.example.com/a");
  });

  it("un grupo sin entradas no se muestra, y sin entradas no hay Trayectoria", () => {
    enRuta({ experience: career.experience, education: [] });

    expect(screen.queryByRole("heading", { name: "Educación" })).not.toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Certificados" })).not.toBeInTheDocument();

    const { container } = render(
      <MemoryRouter>
        <Career career={{ experience: [], education: [] }} />
      </MemoryRouter>,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("no usa imágenes", () => {
    const { container } = enRuta();
    expect(container.querySelector("img, svg")).toBeNull();
  });

  it("en inglés usa sus textos y sus meses", () => {
    enRuta(career, "/en/");

    expect(screen.getByRole("heading", { level: 3, name: "Career" })).toBeInTheDocument();
    expect(screen.getByRole("list", { name: "Experience" })).toHaveTextContent(
      "Sep 2025 – Present",
    );
    expect(screen.getByRole("list", { name: "Licenses & certifications" })).toBeInTheDocument();
    expect(screen.getByRole("list", { name: "Tools: UX Lead B2B" })).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: /View credential/ })).toHaveLength(2);
  });

  it("no tiene violaciones de accesibilidad", async () => {
    const { container } = enRuta();
    expect(await axe(container)).toHaveNoViolations();
  });
});
