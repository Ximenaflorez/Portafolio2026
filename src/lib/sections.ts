// Secciones de la página `/` (contracts/routes.md). El orden es el de la navegación.
export const sections = [
  { id: "inicio", label: "Inicio" },
  { id: "trabajos", label: "Trabajos" },
  { id: "sobre-mi", label: "Sobre mí" },
  { id: "contacto", label: "Contacto" },
] as const;

export type SectionId = (typeof sections)[number]["id"];
