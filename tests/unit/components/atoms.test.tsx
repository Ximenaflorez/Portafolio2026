import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import { axe } from "vitest-axe";
import { describe, expect, it } from "vitest";
import { NavLink } from "~/components/atoms/NavLink";
import { SkipLink } from "~/components/atoms/SkipLink";
import { TextLink } from "~/components/atoms/TextLink";

function enRouter(ui: React.ReactElement) {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
}

describe("SkipLink", () => {
  it("apunta al contenido principal y es lo primero que se enfoca con Tab", async () => {
    enRouter(
      <>
        <SkipLink />
        <a href="/otro">Otro enlace</a>
        <main id="contenido" />
      </>,
    );

    await userEvent.tab();

    const enlace = screen.getByRole("link", { name: "Saltar al contenido" });
    expect(enlace).toHaveAttribute("href", "#contenido");
    expect(enlace).toHaveFocus();
  });

  it("está oculto hasta que recibe el foco y entonces cumple el tamaño mínimo", () => {
    enRouter(<SkipLink />);

    const clases = screen.getByRole("link", { name: "Saltar al contenido" }).className;
    expect(clases).toContain("sr-only");
    expect(clases).toContain("focus:not-sr-only");
    expect(clases).toContain("focus:min-h-target");
  });

  it("no tiene violaciones de accesibilidad", async () => {
    const { container } = enRouter(
      <>
        <SkipLink />
        <main id="contenido">
          <h1>Título</h1>
        </main>
      </>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("NavLink", () => {
  it("marca la sección actual con aria-current=location y no marca las demás", () => {
    enRouter(
      <ul>
        <li>
          <NavLink to="/#inicio" current>
            Inicio
          </NavLink>
        </li>
        <li>
          <NavLink to="/#trabajos" current={false}>
            Trabajos
          </NavLink>
        </li>
      </ul>,
    );

    expect(screen.getByRole("link", { name: "Inicio" })).toHaveAttribute(
      "aria-current",
      "location",
    );
    expect(screen.getByRole("link", { name: "Trabajos" })).not.toHaveAttribute("aria-current");
  });

  it("la sección actual no depende solo del color: subrayado y peso", () => {
    enRouter(
      <NavLink to="/#inicio" current>
        Inicio
      </NavLink>,
    );

    const clases = screen.getByRole("link", { name: "Inicio" }).className;
    expect(clases).toContain("border-primary");
    expect(clases).toContain("font-semibold");
  });

  it("cumple el área mínima y define estados de puntero y presión desde tokens", () => {
    enRouter(<NavLink to="/#inicio">Inicio</NavLink>);

    const clases = screen.getByRole("link", { name: "Inicio" }).className;
    expect(clases).toContain("min-h-target");
    expect(clases).toContain("min-w-target");
    expect(clases).toContain("hover:text-primary-hover");
    expect(clases).toContain("active:text-primary-active");
    expect(clases).toContain("duration-state");
  });

  it("se activa con el teclado y no tiene violaciones de accesibilidad", async () => {
    const { container } = enRouter(
      <nav aria-label="Principal">
        <ul>
          <li>
            <NavLink to="/#trabajos">Trabajos</NavLink>
          </li>
        </ul>
      </nav>,
    );

    await userEvent.tab();
    expect(screen.getByRole("link", { name: "Trabajos" })).toHaveFocus();
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("TextLink", () => {
  it("con `to` es un enlace interno y con `href` es un enlace directo", () => {
    enRouter(
      <>
        <TextLink to="/trabajos/caso-01">Interno</TextLink>
        <TextLink href="mailto:hola@example.com">Correo</TextLink>
      </>,
    );

    expect(screen.getByRole("link", { name: "Interno" })).toHaveAttribute(
      "href",
      "/trabajos/caso-01",
    );
    expect(screen.getByRole("link", { name: "Correo" })).toHaveAttribute(
      "href",
      "mailto:hola@example.com",
    );
  });

  it("en un párrafo (inline) va subrayado y no fuerza el área de 44px", () => {
    enRouter(
      <TextLink href="/x" variant="inline">
        En línea
      </TextLink>,
    );

    const clases = screen.getByRole("link", { name: "En línea" }).className;
    expect(clases).toContain("underline");
    expect(clases).not.toContain("min-h-target");
  });

  it("aislado (standalone) cumple el área mínima de 44×44px", () => {
    enRouter(
      <TextLink href="/x" variant="standalone">
        Aislado
      </TextLink>,
    );

    const clases = screen.getByRole("link", { name: "Aislado" }).className;
    expect(clases).toContain("min-h-target");
    expect(clases).toContain("min-w-target");
  });

  it("define estados de puntero y presión desde tokens, con transición de estado", () => {
    enRouter(<TextLink href="/x">Enlace</TextLink>);

    const clases = screen.getByRole("link", { name: "Enlace" }).className;
    expect(clases).toContain("hover:text-primary-hover");
    expect(clases).toContain("active:text-primary-active");
    expect(clases).toContain("duration-state");
  });

  it("permite descargar un archivo sin navegar dentro de la aplicación", () => {
    enRouter(
      <TextLink href="/cv.pdf" download>
        CV
      </TextLink>,
    );

    expect(screen.getByRole("link", { name: "CV" })).toHaveAttribute("download");
  });

  it("no tiene violaciones de accesibilidad", async () => {
    const { container } = enRouter(
      <p>
        Texto con <TextLink href="/x">un enlace</TextLink>.
      </p>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
