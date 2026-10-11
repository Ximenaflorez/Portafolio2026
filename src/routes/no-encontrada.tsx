import { NotFoundPage } from "~/components/pages/NotFoundPage";

// Un solo archivo de 404 para los dos idiomas: el título lleva ambos.
export function meta() {
  return [
    { title: "Página no encontrada · Page not found" },
    { name: "robots", content: "noindex" },
  ];
}

export default function NoEncontrada() {
  return <NotFoundPage />;
}
