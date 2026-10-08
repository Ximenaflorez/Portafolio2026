import { useEffect, useState } from "react";
import { sections, type SectionId } from "./sections";

// Franja de detección: la sección que cruza entre el 30% y el 40% desde arriba es la actual.
const DETECTION_BAND = "-30% 0px -60% 0px";

/**
 * Devuelve la sección de `/` que se está viendo (FR-031). Si `enabled` es falso
 * (por ejemplo, en la página de un caso) no marca ninguna.
 */
export function useActiveSection(enabled: boolean): SectionId | undefined {
  const [current, setCurrent] = useState<SectionId>("inicio");

  useEffect(() => {
    if (!enabled) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setCurrent(entry.target.id as SectionId);
        }
      },
      { rootMargin: DETECTION_BAND },
    );
    for (const { id } of sections) {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    }

    // Al llegar al final, la última sección puede no cruzar la franja de detección.
    const onScroll = () => {
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 1) {
        setCurrent(sections[sections.length - 1].id);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [enabled]);

  return enabled ? current : undefined;
}

/** Salto suave a una sección, solo si el sistema no pide reducir movimiento (FR-029). */
export function useAnchorScrollBehavior(): void {
  useEffect(() => {
    const root = document.documentElement;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    root.style.scrollBehavior = reduced.matches ? "auto" : "smooth";
    return () => {
      root.style.scrollBehavior = "";
    };
  }, []);
}
