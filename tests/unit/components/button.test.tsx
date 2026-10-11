import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import { axe } from "vitest-axe";
import { describe, expect, it, vi } from "vitest";
import { Button } from "~/components/atoms/Button";

function enRouter(ui: React.ReactElement) {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
}

describe("Button (FR-033)", () => {
  it("la variante primaria tiene relleno Primary, texto on-primary y contorno Primary", () => {
    enRouter(
      <Button variant="primary" href="/x">
        Ver
      </Button>,
    );

    const clases = screen.getByRole("link", { name: "Ver" }).className.split(/\s+/);
    expect(clases).toContain("bg-primary");
    expect(clases).toContain("text-on-primary");
    expect(clases).toContain("border-primary");
  });

  it("la variante secundaria es tonal: relleno secondary-container, texto y contorno Primary", () => {
    enRouter(
      <Button variant="secondary" href="/x">
        Escríbeme
      </Button>,
    );

    const clases = screen.getByRole("link", { name: "Escríbeme" }).className.split(/\s+/);
    expect(clases).toContain("bg-secondary-container");
    expect(clases).toContain("border-primary");
    expect(clases).toContain("text-primary");
    expect(clases).not.toContain("bg-primary");
    expect(clases).not.toContain("bg-transparent");
  });

  it("las dos variantes son píldoras del mismo tamaño: mismo borde, relleno y área mínima", () => {
    enRouter(
      <>
        <Button variant="primary" href="/a">
          Uno
        </Button>
        <Button variant="secondary" href="/b">
          Dos
        </Button>
      </>,
    );

    for (const nombre of ["Uno", "Dos"]) {
      const clases = screen.getByRole("link", { name: nombre }).className.split(/\s+/);
      for (const esperada of ["rounded-button", "border", "px-4", "min-h-target", "min-w-target"]) {
        expect(clases).toContain(esperada);
      }
    }
  });

  it("en teléfono ocupan todo el ancho y desde `sm` el de su contenido", () => {
    enRouter(
      <>
        <Button variant="primary" href="/a">
          Uno
        </Button>
        <Button variant="secondary" onClick={() => {}}>
          Dos
        </Button>
      </>,
    );

    for (const elemento of [
      screen.getByRole("link", { name: "Uno" }),
      screen.getByRole("button", { name: "Dos" }),
    ]) {
      const clases = elemento.className.split(/\s+/);
      expect(clases).toContain("w-full");
      expect(clases).toContain("sm:w-auto");
    }
  });

  it.each([
    ["primary", "after:bg-on-primary"],
    ["secondary", "after:bg-primary"],
  ] as const)(
    "la variante %s marca puntero y presión con una capa de estado (%s), sin cambiar de color",
    (variante, capa) => {
      enRouter(
        <Button variant={variante} href="/x">
          Acción
        </Button>,
      );

      const clases = screen.getByRole("link", { name: "Acción" }).className.split(/\s+/);
      for (const esperada of [
        "relative",
        capa,
        "after:absolute",
        "after:inset-0",
        "after:rounded-inherit",
        "after:content-empty",
        "after:pointer-events-none",
        "after:opacity-0",
        "hover:after:opacity-state-hover",
        "active:after:opacity-state-press",
        "after:duration-state",
        "duration-state",
      ]) {
        expect(clases).toContain(esperada);
      }
      expect(clases.some((clase) => /^(hover|active):(bg|border|text)-/.test(clase))).toBe(false);
    },
  );

  it("con `href` es un enlace; con `to` es un enlace interno; sin ninguno es un botón", () => {
    enRouter(
      <>
        <Button variant="primary" href="mailto:hola@example.com">
          Correo
        </Button>
        <Button variant="primary" to="/trabajos/caso-01">
          Interno
        </Button>
        <Button variant="primary" onClick={() => {}}>
          Acción
        </Button>
      </>,
    );

    expect(screen.getByRole("link", { name: "Correo" })).toHaveAttribute(
      "href",
      "mailto:hola@example.com",
    );
    expect(screen.getByRole("link", { name: "Interno" })).toHaveAttribute(
      "href",
      "/trabajos/caso-01",
    );
    expect(screen.getByRole("button", { name: "Acción" })).toHaveAttribute("type", "button");
  });

  it("se alcanza con Tab y se activa con Enter y con Espacio (botón)", async () => {
    const alActivar = vi.fn();
    enRouter(
      <Button variant="secondary" onClick={alActivar}>
        Activar
      </Button>,
    );

    await userEvent.tab();
    expect(screen.getByRole("button", { name: "Activar" })).toHaveFocus();

    await userEvent.keyboard("{Enter}");
    await userEvent.keyboard(" ");
    expect(alActivar).toHaveBeenCalledTimes(2);
  });

  it("no tiene violaciones de accesibilidad", async () => {
    const { container } = enRouter(
      <div>
        <Button variant="primary" href="/a">
          Ver mis trabajos
        </Button>
        <Button variant="secondary" href="mailto:hola@example.com">
          Escríbeme
        </Button>
      </div>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
