import { useEffect, type RefObject } from "react";

/** Altura del encabezado que sigue tapando la página cuando está fijo. */
export function visibleHeaderOffset(header: HTMLElement): number {
  const top = Number.parseFloat(getComputedStyle(header).top);
  const hidden = Number.isFinite(top) ? Math.max(0, -top) : 0;
  return Math.max(0, header.offsetHeight - hidden);
}

/**
 * Publica esa altura en `--header-visible` para el `scroll-padding-top`.
 * Si el menú pasa a dos filas, o el texto crece, el salto a una sección no queda debajo.
 */
export function useVisibleHeaderOffset(headerRef: RefObject<HTMLElement | null>): void {
  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    const root = document.documentElement;
    const apply = () => {
      root.style.setProperty("--header-visible", `${visibleHeaderOffset(header)}px`);
    };

    apply();
    const observer = typeof ResizeObserver === "undefined" ? undefined : new ResizeObserver(apply);
    observer?.observe(header);
    window.addEventListener("resize", apply);

    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", apply);
      root.style.removeProperty("--header-visible");
    };
  }, [headerRef]);
}
