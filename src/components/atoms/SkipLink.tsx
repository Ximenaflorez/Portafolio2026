// Primer elemento enfocable de toda página (FR-017). Oculto hasta recibir el foco.
export function SkipLink({ children = "Saltar al contenido" }: { children?: string }) {
  return (
    <a
      href="#contenido"
      className="sr-only bg-primary px-3 text-on-primary focus:not-sr-only focus:fixed focus:left-2 focus:top-2 focus:z-20 focus:inline-flex focus:min-h-target focus:items-center"
    >
      {children}
    </a>
  );
}
