// Secciones de la página principal (contracts/routes.md). El orden es el de la navegación y los
// `id` son los mismos en los dos idiomas; el texto de cada enlace sale de los textos de interfaz
// (`nav.<id>`).
export const sections = [
  { id: "inicio" },
  { id: "trabajos" },
  { id: "sobre-mi" },
  { id: "contacto" },
] as const;

export type SectionId = (typeof sections)[number]["id"];
