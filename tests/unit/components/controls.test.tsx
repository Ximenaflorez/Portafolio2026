import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderToString } from "react-dom/server";
import { MemoryRouter } from "react-router";
import { axe } from "vitest-axe";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { LanguageSwitch } from "~/components/atoms/LanguageSwitch";
import { MenuToggle } from "~/components/atoms/MenuToggle";
import { ThemeToggle } from "~/components/atoms/ThemeToggle";

function systemPrefersDark(dark: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: dark && query.includes("prefers-color-scheme: dark"),
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
  })) as unknown as typeof window.matchMedia;
}

beforeEach(() => {
  localStorage.clear();
  document.documentElement.removeAttribute("data-theme");
  systemPrefersDark(false);
});

afterEach(() => {
  document.documentElement.removeAttribute("data-theme");
});

describe("ThemeToggle (FR-038)", () => {
  it("es un botón con nombre accesible constante y aria-pressed según el tema", () => {
    render(<ThemeToggle label="Tema oscuro" />);

    const button = screen.getByRole("button", { name: "Tema oscuro" });
    expect(button).toHaveAttribute("aria-pressed", "false");
  });

  it("parte del sistema: si el sistema es oscuro, está activado", () => {
    systemPrefersDark(true);
    render(<ThemeToggle label="Tema oscuro" />);

    expect(screen.getByRole("button", { name: "Tema oscuro" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("al activarlo cambia el tema del documento y lo recuerda; el nombre no cambia", async () => {
    render(<ThemeToggle label="Tema oscuro" />);
    const button = screen.getByRole("button", { name: "Tema oscuro" });

    await userEvent.click(button);

    expect(document.documentElement.dataset.theme).toBe("dark");
    expect(localStorage.getItem("theme")).toBe("dark");
    expect(button).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "Tema oscuro" })).toBe(button);

    await userEvent.click(button);

    expect(document.documentElement.dataset.theme).toBe("light");
    expect(button).toHaveAttribute("aria-pressed", "false");
  });

  it("se activa con el teclado (Enter y Espacio)", async () => {
    render(<ThemeToggle label="Dark theme" />);
    const button = screen.getByRole("button", { name: "Dark theme" });

    await userEvent.tab();
    expect(button).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    expect(button).toHaveAttribute("aria-pressed", "true");
    await userEvent.keyboard(" ");
    expect(button).toHaveAttribute("aria-pressed", "false");
  });

  it("muestra un sol con el tema claro y una luna con el oscuro", async () => {
    const { container } = render(<ThemeToggle label="Tema oscuro" />);
    expect(container.querySelector("svg")).toHaveAttribute("data-icon", "sun");

    await userEvent.click(screen.getByRole("button", { name: "Tema oscuro" }));

    expect(container.querySelector("svg")).toHaveAttribute("data-icon", "moon");
  });

  it("el ícono es decorativo: no aporta nombre ni se enfoca", () => {
    const { container } = render(<ThemeToggle label="Tema oscuro" />);
    const icon = container.querySelector("svg")!;

    expect(icon).toHaveAttribute("aria-hidden", "true");
    expect(icon).toHaveAttribute("focusable", "false");
  });

  it("tiene un área de al menos 44×44 px y usa el color del texto (FR-027)", () => {
    render(<ThemeToggle label="Tema oscuro" />);
    const clases = screen.getByRole("button").className;

    expect(clases).toContain("min-h-target");
    expect(clases).toContain("min-w-target");
    expect(clases).toContain("text-text");
  });

  it("sin JavaScript no hay botón que no funcione: el servidor reserva su lugar y nada más", () => {
    const html = renderToString(<ThemeToggle label="Tema oscuro" />);

    expect(html).not.toContain("<button");
    expect(html).toContain("min-w-target");
  });

  it("no tiene violaciones de accesibilidad", async () => {
    const { container } = render(<ThemeToggle label="Tema oscuro" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("MenuToggle", () => {
  const props = {
    open: false,
    openLabel: "Abrir menú",
    closeLabel: "Cerrar menú",
    controls: "menu-principal",
    onClick: vi.fn(),
  };

  it("nombra el panel, dice si está abierto y tiene área de 44×44 px (FR-027)", () => {
    render(<MenuToggle {...props} />);
    const button = screen.getByRole("button", { name: "Abrir menú" });

    expect(button).toHaveAttribute("aria-expanded", "false");
    expect(button).toHaveAttribute("aria-controls", "menu-principal");
    expect(button.className).toContain("min-h-target");
    expect(button.className).toContain("min-w-target");
    expect(button.className).toContain("sm:hidden");
  });

  it("al estar abierto cambia el nombre y el ícono", () => {
    const { container } = render(<MenuToggle {...props} open />);
    expect(screen.getByRole("button", { name: "Cerrar menú" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    expect(container.querySelector("svg")).toHaveAttribute("data-icon", "close");
  });

  it("se activa con el teclado", async () => {
    const onClick = vi.fn();
    render(<MenuToggle {...props} onClick={onClick} />);

    await userEvent.tab();
    expect(screen.getByRole("button")).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    expect(onClick).toHaveBeenCalled();
  });

  it("no tiene violaciones de accesibilidad", async () => {
    const { container } = render(<MenuToggle {...props} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("LanguageSwitch (FR-040)", () => {
  const props = { to: "/en/#trabajos", code: "EN", name: "English", language: "en" } as const;

  function enRuta(ui: React.ReactElement) {
    return render(<MemoryRouter>{ui}</MemoryRouter>);
  }

  it("es un enlace a la página equivalente, con hreflang y lang del otro idioma", () => {
    enRuta(<LanguageSwitch {...props} />);

    const link = screen.getByRole("link", { name: "EN English" });
    expect(link).toHaveAttribute("href", "/en/#trabajos");
    expect(link).toHaveAttribute("hreflang", "en");
    expect(link).toHaveAttribute("lang", "en");
  });

  it("muestra el código y su nombre accesible empieza por él (2.5.3)", () => {
    enRuta(<LanguageSwitch {...props} />);

    const link = screen.getByRole("link");
    expect(link.textContent).toContain("EN");
    expect(link.getAttribute("aria-label")).toBeNull();
    expect(screen.getByRole("link", { name: /^EN\b/ })).toBeInTheDocument();
  });

  it("al revés: en inglés muestra ES y Español", () => {
    enRuta(<LanguageSwitch to="/" code="ES" name="Español" language="es" />);

    expect(screen.getByRole("link", { name: "ES Español" })).toHaveAttribute("lang", "es");
  });

  it("tiene un área de al menos 44×44 px (FR-027)", () => {
    enRuta(<LanguageSwitch {...props} />);
    const clases = screen.getByRole("link").className;

    expect(clases).toContain("min-h-target");
    expect(clases).toContain("min-w-target");
  });

  it("se alcanza con el teclado", async () => {
    enRuta(<LanguageSwitch {...props} />);

    await userEvent.tab();
    expect(screen.getByRole("link")).toHaveFocus();
  });

  it("no tiene violaciones de accesibilidad", async () => {
    const { container } = enRuta(<LanguageSwitch {...props} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
