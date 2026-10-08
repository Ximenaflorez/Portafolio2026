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
  it("la variante primaria tiene relleno Primary y texto on-primary", () => {
    enRouter(
      <Button variant="primary" href="/x">
        Ver
      </Button>,
    );

    const clases = screen.getByRole("link", { name: "Ver" }).className;
    expect(clases).toContain("bg-primary");
    expect(clases).toContain("text-on-primary");
  });

  it("la variante secundaria no tiene relleno y usa borde y texto Primary", () => {
    enRouter(
      <Button variant="secondary" href="/x">
        Escríbeme
      </Button>,
    );

    const clases = screen.getByRole("link", { name: "Escríbeme" }).className;
    expect(clases).toContain("bg-transparent");
    expect(clases).toContain("border-primary");
    expect(clases).toContain("text-primary");
    expect(clases).not.toContain("bg-primary");
  });

  it("las dos variantes tienen el mismo tamaño: mismo borde, relleno y área mínima", () => {
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
      const clases = screen.getByRole("link", { name: nombre }).className;
      expect(clases).toContain("border-control");
      expect(clases).toContain("px-4");
      expect(clases).toContain("min-h-target");
      expect(clases).toContain("min-w-target");
    }
  });

  it.each([
    [
      "primary",
      [
        "hover:bg-primary-hover",
        "hover:border-primary-hover",
        "active:bg-primary-active",
        "active:border-primary-active",
      ],
    ],
    [
      "secondary",
      [
        "hover:text-primary-hover",
        "hover:border-primary-hover",
        "active:text-primary-active",
        "active:border-primary-active",
      ],
    ],
  ] as const)("la variante %s distingue puntero y presión con tokens", (variante, esperadas) => {
    enRouter(
      <Button variant={variante} href="/x">
        Acción
      </Button>,
    );

    const clases = screen.getByRole("link", { name: "Acción" }).className;
    for (const clase of esperadas) expect(clases).toContain(clase);
    expect(clases).toContain("duration-state");
  });

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
