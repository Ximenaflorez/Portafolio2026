import { Button } from "~/components/atoms/Button";
import { TextLink } from "~/components/atoms/TextLink";
import { perfil, PlantillaPrototipo, rutaCaso } from "./piezas";

// Prototipo de aprobación T046: página principal (`/`) con las cuatro secciones, como el
// portafolio anterior. En desarrollo sustituye a la página de Inicio; se borra al aprobarse.
// Contenido INVENTADO. Los tres casos de Trabajos llevan a la misma página de caso de ejemplo.

const casosIndice = [
  {
    titulo: "Rediseño del flujo de despacho en una plataforma logística B2B",
    tipo: "B2B SaaS",
    rol: "Product Designer líder",
    linea: "Entre 20% y 30% menos abandono en el flujo de despacho.",
  },
  {
    titulo: "Panel de seguimiento para equipos de campo",
    tipo: "App móvil interna",
    rol: "Product Designer",
    linea: "El tiempo de registro de una visita bajó a la mitad.",
  },
  {
    titulo: "Sistema de diseño para tres productos de una fintech",
    tipo: "Sistema de diseño",
    rol: "Diseñador de sistemas",
    linea: "Un 40% menos de componentes duplicados entre productos.",
  },
];

export function meta() {
  return [{ title: "Prototipo: página principal" }, { name: "robots", content: "noindex" }];
}

export default function PrototipoPortada() {
  return (
    <PlantillaPrototipo>
      <section id="inicio" aria-labelledby="titulo-inicio" className="py-16">
        <p className="text-text-muted">Product Designer y UX Engineer</p>
        <h1 id="titulo-inicio" className="mt-1 text-4xl">
          Propuesta de valor en una frase clara
        </h1>
        <p className="mt-2 text-lg text-text-muted">
          Texto de prueba: qué haces y para quién. Aquí iría el resumen que hoy vive en Inicio.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button variant="primary" to="/#trabajos">
            Ver mis trabajos
          </Button>
          <Button variant="secondary" href={`mailto:${perfil.email}`}>
            Escríbeme
          </Button>
        </div>
      </section>

      <section
        id="trabajos"
        aria-labelledby="titulo-trabajos"
        className="border-t border-border py-16"
      >
        <h2 id="titulo-trabajos" className="text-3xl">
          Trabajos
        </h2>
        <p className="mt-1 text-text-muted">
          Tres casos de producto, con el problema, la evidencia, las decisiones y el resultado de
          cada uno.
        </p>
        <ul className="mt-6 grid gap-4 md:grid-cols-3">
          {casosIndice.map((item) => (
            <li key={item.titulo} className="flex flex-col border border-border bg-surface p-4">
              <p className="text-sm text-text-muted">{item.tipo}</p>
              <h3 className="mt-0.5 text-xl">{item.titulo}</h3>
              <p className="mt-1 text-sm text-text-muted">{item.rol}</p>
              <p className="mt-2 flex-1">{item.linea}</p>
              <div className="mt-2">
                <TextLink to={rutaCaso} variant="standalone" className="font-semibold">
                  Leer el caso<span className="sr-only">: {item.titulo}</span>
                </TextLink>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-4 border border-border-strong bg-surface p-4">
          <p className="text-sm text-text-muted">El caso de este portafolio</p>
          <h3 className="mt-0.5 text-xl">Cómo construí este portafolio</h3>
          <p className="mt-1">
            El sistema de diseño, la estructura de componentes, el enfoque de accesibilidad y el uso
            de IA en el desarrollo.
          </p>
          <div className="mt-2">
            <TextLink to={rutaCaso} variant="standalone" className="font-semibold">
              Leer el caso<span className="sr-only">: Cómo construí este portafolio</span>
            </TextLink>
          </div>
        </div>
      </section>

      <section
        id="sobre-mi"
        aria-labelledby="titulo-sobre-mi"
        className="border-t border-border py-16"
      >
        <h2 id="titulo-sobre-mi" className="text-3xl">
          Sobre mí
        </h2>
        {["Forma de trabajar", "Métodos", "Problemas que busco"].map((tema) => (
          <div key={tema} className="mt-4">
            <h3 className="text-xl">{tema}</h3>
            <p className="mt-1 text-text-muted">
              Texto de prueba para ver cuánto ocupa esta sección dentro de la página larga.
            </p>
          </div>
        ))}
      </section>

      <section
        id="contacto"
        aria-labelledby="titulo-contacto"
        className="border-t border-border py-16"
      >
        <h2 id="titulo-contacto" className="text-3xl">
          Contacto
        </h2>
        <p className="mt-1 text-text-muted">Texto breve de invitación a contactar.</p>
        <ul className="mt-2 flex flex-wrap gap-x-3">
          <li>
            <TextLink variant="standalone" href={`mailto:${perfil.email}`}>
              {perfil.email}
            </TextLink>
          </li>
          <li>
            <TextLink variant="standalone" href={perfil.linkedin}>
              LinkedIn
            </TextLink>
          </li>
          <li>
            <TextLink variant="standalone" href={perfil.cv} download>
              Descargar CV (PDF)
            </TextLink>
          </li>
        </ul>
      </section>
    </PlantillaPrototipo>
  );
}
