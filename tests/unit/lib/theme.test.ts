import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  applyTheme,
  currentTheme,
  readStoredTheme,
  subscribeTheme,
  themeInitScript,
  themeStorageKey,
  toggleTheme,
} from "~/lib/theme";

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
  vi.restoreAllMocks();
});

describe("elección de tema guardada (FR-038)", () => {
  it("la clave de almacenamiento es `theme`", () => {
    expect(themeStorageKey).toBe("theme");
  });

  it("sin elección guardada no hay tema elegido", () => {
    expect(readStoredTheme()).toBeNull();
  });

  it.each(["light", "dark"] as const)("lee la elección %s", (theme) => {
    localStorage.setItem("theme", theme);
    expect(readStoredTheme()).toBe(theme);
  });

  it("ignora un valor guardado que no es un tema", () => {
    localStorage.setItem("theme", "sepia");
    expect(readStoredTheme()).toBeNull();
  });

  it("si el almacenamiento no está disponible, no falla", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("bloqueado");
    });
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("bloqueado");
    });

    expect(readStoredTheme()).toBeNull();
    expect(() => applyTheme("dark")).not.toThrow();
    expect(document.documentElement.dataset.theme).toBe("dark");
  });
});

describe("tema que se ve", () => {
  it("sin elección sigue la preferencia del sistema", () => {
    expect(currentTheme()).toBe("light");
    systemPrefersDark(true);
    expect(currentTheme()).toBe("dark");
  });

  it("la elección manda sobre el sistema", () => {
    systemPrefersDark(true);
    applyTheme("light");
    expect(currentTheme()).toBe("light");
  });

  it("aplicar un tema lo marca en el documento y lo recuerda", () => {
    applyTheme("dark");

    expect(document.documentElement.dataset.theme).toBe("dark");
    expect(localStorage.getItem("theme")).toBe("dark");
  });

  it("alternar cambia al otro tema, partiendo del que se ve", () => {
    systemPrefersDark(true);

    expect(toggleTheme()).toBe("light");
    expect(document.documentElement.dataset.theme).toBe("light");
    expect(toggleTheme()).toBe("dark");
  });

  it("avisa a quien escucha cuando cambia el tema, y deja de avisar al cancelar", () => {
    const listener = vi.fn();
    const unsubscribe = subscribeTheme(listener);

    applyTheme("dark");
    expect(listener).toHaveBeenCalledTimes(1);

    unsubscribe();
    applyTheme("light");
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it("al cambiar de tema las transiciones de color se suspenden un instante (sin animación)", () => {
    applyTheme("dark");

    expect(document.documentElement).toHaveAttribute("data-theme-switching");
  });
});

describe("script en línea del <head> (sin destello)", () => {
  function run() {
    new Function(themeInitScript)();
  }

  it("aplica la elección guardada antes de pintar", () => {
    localStorage.setItem("theme", "dark");
    run();
    expect(document.documentElement.dataset.theme).toBe("dark");
  });

  it("sin elección no toca el documento: manda el sistema", () => {
    run();
    expect(document.documentElement).not.toHaveAttribute("data-theme");
  });

  it("ignora un valor inválido", () => {
    localStorage.setItem("theme", "sepia");
    run();
    expect(document.documentElement).not.toHaveAttribute("data-theme");
  });

  it("no falla si el almacenamiento está bloqueado", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("bloqueado");
    });

    expect(run).not.toThrow();
  });
});
