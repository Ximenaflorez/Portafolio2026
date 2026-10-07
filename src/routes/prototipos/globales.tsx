import { Link, useSearchParams } from "react-router";

// Prototipo de aprobación T035: contenido de prueba, solo en desarrollo; se borra al aprobarse.
const persona = {
  nombre: "Nombre Apellido",
  correo: "nombre@ejemplo.com",
  linkedin: "https://www.linkedin.com/in/ejemplo",
};

const paginas = [
  { id: "inicio", label: "Inicio" },
  { id: "trabajos", label: "Trabajos" },
  { id: "sobre-mi", label: "Sobre mí" },
  { id: "contacto", label: "Contacto" },
] as const;

type PaginaId = (typeof paginas)[number]["id"];

const enlace =
  "inline-flex min-h-target min-w-target items-center text-text transition-colors duration-state hover:text-primary-hover active:text-primary-active";

function Navegacion({ actual, etiqueta }: { actual: PaginaId; etiqueta: string }) {
  return (
    <nav aria-label={etiqueta}>
      <ul className="flex flex-wrap gap-x-2">
        {paginas.map((pagina) => {
          const esActual = pagina.id === actual;
          return (
            <li key={pagina.id}>
              <Link
                to={`?pagina=${pagina.id}`}
                aria-current={esActual ? "page" : undefined}
                className={`${enlace} border-b-indicator ${
                  esActual ? "border-primary font-semibold text-primary" : "border-transparent"
                }`}
              >
                {pagina.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export function meta() {
  return [{ title: "Prototipo: elementos globales" }, { name: "robots", content: "noindex" }];
}

export default function PrototipoGlobales() {
  const [params] = useSearchParams();
  const actual = (paginas.find((p) => p.id === params.get("pagina"))?.id ?? "inicio") as PaginaId;
  const titulo = paginas.find((p) => p.id === actual)?.label;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <a
        href="#contenido"
        className="sr-only bg-primary px-3 text-on-primary focus:not-sr-only focus:fixed focus:z-10 focus:left-2 focus:top-2 focus:inline-flex focus:min-h-target focus:items-center"
      >
        Saltar al contenido
      </a>

      <header className="border-b border-border">
        <div className="mx-auto flex max-w-content flex-col gap-1 px-3 py-2 sm:flex-row sm:items-center sm:justify-between md:px-4">
          <Link to="?pagina=inicio" className={`${enlace} font-heading text-lg font-bold`}>
            {persona.nombre}
          </Link>
          <Navegacion actual={actual} etiqueta="Principal" />
        </div>
      </header>

      <main
        id="contenido"
        tabIndex={-1}
        className="mx-auto w-full max-w-content flex-1 px-3 py-8 md:px-4"
      >
        <h1 className="text-3xl">{titulo}</h1>
        <p className="mt-2 text-text-muted">
          Página de prueba para revisar el encabezado, la navegación y el pie. Usa Tab para recorrer
          los enlaces: el primero es «Saltar al contenido».
        </p>
        {[1, 2, 3].map((n) => (
          <section key={n} className="mt-6 border border-border bg-surface p-4">
            <h2 className="text-xl">Bloque de prueba {n}</h2>
            <p className="mt-1 text-text-muted">
              Contenido de relleno para comprobar que el encabezado no es fijo y se va con el
              scroll.
            </p>
          </section>
        ))}
      </main>

      <footer className="border-t border-border bg-surface">
        <div className="mx-auto flex max-w-content flex-col gap-4 px-3 py-6 md:px-4">
          <div className="flex flex-col gap-4 md:flex-row md:justify-between">
            <ul className="flex flex-wrap gap-x-3" aria-label="Contacto">
              <li>
                <a href={`mailto:${persona.correo}`} className={enlace}>
                  {persona.correo}
                </a>
              </li>
              <li>
                <a href={persona.linkedin} className={enlace}>
                  LinkedIn
                </a>
              </li>
              <li>
                <a href="/cv.pdf" download className={enlace}>
                  Descargar CV (PDF)
                </a>
              </li>
            </ul>
            <Navegacion actual={actual} etiqueta="Pie de página" />
          </div>
          <div className="flex flex-col gap-1 text-sm text-text-muted sm:flex-row sm:justify-between">
            <p>
              Diseñado y construido por {persona.nombre}.{" "}
              <a
                href="/trabajos/este-portafolio"
                className="text-primary underline transition-colors duration-state hover:text-primary-hover active:text-primary-active"
              >
                Cómo hice este portafolio
              </a>
            </p>
            <p>
              © {new Date().getFullYear()} {persona.nombre}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
