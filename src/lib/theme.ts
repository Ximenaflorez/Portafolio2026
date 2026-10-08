// Tema claro u oscuro (FR-036, FR-038). Los componentes no conocen el tema: aquí solo se marca
// `data-theme` en el documento y se recuerda la elección. Los valores salen de los tokens.

export type Theme = "light" | "dark";

export const themeStorageKey = "theme";

const changeEvent = "themechange";

function isTheme(value: unknown): value is Theme {
  return value === "light" || value === "dark";
}

/** La elección de la persona, o `null` si nunca eligió (entonces manda el sistema). */
export function readStoredTheme(): Theme | null {
  try {
    const stored = localStorage.getItem(themeStorageKey);
    return isTheme(stored) ? stored : null;
  } catch {
    return null;
  }
}

function systemQuery(): MediaQueryList | null {
  return typeof window.matchMedia === "function"
    ? window.matchMedia("(prefers-color-scheme: dark)")
    : null;
}

export function systemTheme(): Theme {
  return systemQuery()?.matches ? "dark" : "light";
}

/** El tema que se está viendo ahora. */
export function currentTheme(): Theme {
  const marked = document.documentElement.dataset.theme;
  return isTheme(marked) ? marked : systemTheme();
}

/** Aplica el tema, lo recuerda y avisa a quien escucha. Cambiar de tema no se anima. */
export function applyTheme(theme: Theme): void {
  const root = document.documentElement;
  // Las transiciones de color se suspenden solo mientras se aplican los nuevos valores.
  root.setAttribute("data-theme-switching", "");
  root.dataset.theme = theme;
  try {
    localStorage.setItem(themeStorageKey, theme);
  } catch {
    // Sin almacenamiento el tema vale solo para esta visita.
  }
  window.dispatchEvent(new Event(changeEvent));
  requestAnimationFrame(() => {
    requestAnimationFrame(() => root.removeAttribute("data-theme-switching"));
  });
}

export function toggleTheme(): Theme {
  const next = currentTheme() === "dark" ? "light" : "dark";
  applyTheme(next);
  return next;
}

/** Escucha cambios de tema: el botón y el sistema. Devuelve la función que cancela. */
export function subscribeTheme(listener: () => void): () => void {
  const query = systemQuery();
  window.addEventListener(changeEvent, listener);
  query?.addEventListener("change", listener);
  return () => {
    window.removeEventListener(changeEvent, listener);
    query?.removeEventListener("change", listener);
  };
}

/**
 * Script mínimo en línea para `<head>`: aplica la elección guardada antes de pintar y así no hay
 * destello del tema equivocado. Sin elección guardada no hace nada y manda el sistema.
 */
export const themeInitScript = `(function(){try{var t=localStorage.getItem("${themeStorageKey}");if(t==="light"||t==="dark"){document.documentElement.setAttribute("data-theme",t)}}catch(e){}})()`;
