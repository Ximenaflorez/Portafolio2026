import type { ReactNode } from "react";
import { SiteTemplate } from "~/components/templates/SiteTemplate";

// Piezas compartidas de los prototipos T046 (contenido INVENTADO y anonimizado, FR-030).
// Solo en desarrollo; se borran al aprobarse. Las cajas «Qué anexar» y los recuadros de imagen
// son andamios del prototipo: no existirán en el sitio real.

export const perfil = {
  name: "Nombre Apellido",
  email: "nombre@ejemplo.com",
  linkedin: "https://www.linkedin.com/in/ejemplo",
  cv: "/cv.pdf",
};

export const rutaCaso = "/prototipos/caso";

export function PlantillaPrototipo({ children }: { children: ReactNode }) {
  return (
    <SiteTemplate profile={perfil} cvAvailable metaCaseHref={rutaCaso} year={2026}>
      {children}
    </SiteTemplate>
  );
}

export function Anexar({ children }: { children: ReactNode }) {
  return (
    <aside
      aria-label="Guía del prototipo"
      className="mt-2 border border-dashed border-border-strong bg-surface p-2 text-sm text-text"
    >
      <strong>Qué anexar aquí (solo prototipo):</strong> {children}
    </aside>
  );
}

export function Campo({ etiqueta, children }: { etiqueta: string; children: ReactNode }) {
  return (
    <div>
      <dt className="font-semibold">{etiqueta}</dt>
      <dd className="mt-0.5">{children}</dd>
    </div>
  );
}
