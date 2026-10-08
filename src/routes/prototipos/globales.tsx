import { useEffect, useState } from "react";

// Prototipo de aprobación T035: una sola página con secciones, encabezado fijo.
// Contenido de prueba, solo en desarrollo; se borra al aprobarse.
const persona = {
  nombre: "Nombre Apellido",
  rol: "Product Designer y UX Engineer",
  correo: "nombre@ejemplo.com",
  linkedin: "https://www.linkedin.com/in/ejemplo",
};

const secciones = [
  { id: "inicio", label: "Inicio" },
  { id: "trabajos", label: "Trabajos" },
  { id: "sobre-mi", label: "Sobre mí" },
  { id: "contacto", label: "Contacto" },
] as const;

type SeccionId = (typeof secciones)[number]["id"];

const casos = [
  {
    id: "caso-01",
    titulo: "Caso 1: título del proyecto",
    linea: "Resultado en una frase, medible.",
  },
  {
    id: "caso-02",
    titulo: "Caso 2: título del proyecto",
    linea: "Resultado en una frase, medible.",
  },
  {
    id: "caso-03",
    titulo: "Caso 3: título del proyecto",
    linea: "Resultado en una frase, medible.",
  },
];

const enlace =
  "inline-flex min-h-target min-w-target items-center text-text transition-colors duration-state hover:text-primary-hover active:text-primary-active";

// Botones: mismo tamaño y borde en las dos variantes para que midan lo mismo.
const botonBase =
  "inline-flex min-h-target min-w-target items-center justify-center border-control px-4 font-semibold transition-colors duration-state";
const botonPrimario = `${botonBase} border-primary bg-primary text-on-primary hover:border-primary-hover hover:bg-primary-hover active:border-primary-active active:bg-primary-active`;
const botonSecundario = `${botonBase} border-primary bg-transparent text-primary hover:border-primary-hover hover:text-primary-hover active:border-primary-active active:text-primary-active`;

// Muestrario: los mismos botones con el estado fijado (no son controles).
const estadosPrimario = [
  { estado: "Reposo", clases: "border-primary bg-primary text-on-primary" },
  { estado: "Puntero encima", clases: "border-primary-hover bg-primary-hover text-on-primary" },
  { estado: "Presionado", clases: "border-primary-active bg-primary-active text-on-primary" },
];
const estadosSecundario = [
  { estado: "Reposo", clases: "border-primary bg-transparent text-primary" },
  { estado: "Puntero encima", clases: "border-primary-hover bg-transparent text-primary-hover" },
  { estado: "Presionado", clases: "border-primary-active bg-transparent text-primary-active" },
];

const enlaceTexto =
  "text-primary underline transition-colors duration-state hover:text-primary-hover active:text-primary-active";

function Navegacion({ actual, etiqueta }: { actual: SeccionId; etiqueta: string }) {
  return (
    <nav aria-label={etiqueta}>
      <ul className="flex flex-wrap gap-x-2">
        {secciones.map((seccion) => {
          const esActual = seccion.id === actual;
          return (
            <li key={seccion.id}>
              <a
                href={`#${seccion.id}`}
                aria-current={esActual ? "location" : undefined}
                className={`${enlace} border-b-indicator ${
                  esActual ? "border-primary font-semibold text-primary" : "border-transparent"
                }`}
              >
                {seccion.label}
              </a>
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
  const [actual, setActual] = useState<SeccionId>("inicio");

  useEffect(() => {
    // FR-029: el desplazamiento suave solo existe si el sistema no pide reducir movimiento.
    const raiz = document.documentElement;
    const sinMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)");
    raiz.style.scrollBehavior = sinMovimiento.matches ? "auto" : "smooth";

    const observador = new IntersectionObserver(
      (entradas) => {
        for (const entrada of entradas) {
          if (entrada.isIntersecting) setActual(entrada.target.id as SeccionId);
        }
      },
      { rootMargin: "-30% 0px -60% 0px" },
    );
    for (const { id } of secciones) {
      const el = document.getElementById(id);
      if (el) observador.observe(el);
    }

    // Al llegar al final, la última sección puede no cruzar la franja de detección.
    const alFinal = () => {
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 1) {
        setActual(secciones[secciones.length - 1].id);
      }
    };
    window.addEventListener("scroll", alFinal, { passive: true });

    return () => {
      observador.disconnect();
      window.removeEventListener("scroll", alFinal);
      raiz.style.scrollBehavior = "";
    };
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <a
        href="#contenido"
        className="sr-only bg-primary px-3 text-on-primary focus:not-sr-only focus:fixed focus:left-2 focus:top-2 focus:z-20 focus:inline-flex focus:min-h-target focus:items-center"
      >
        Saltar al contenido
      </a>

      {/* Fijo. En teléfono el nombre sale con el scroll y solo queda la fila del menú. */}
      <header className="sticky top-header-collapse z-10 border-b border-border bg-background sm:top-0">
        <div className="mx-auto flex max-w-content flex-col px-3 sm:flex-row sm:items-center sm:justify-between md:px-4">
          <div className="pt-1 sm:py-1">
            <a href="#inicio" className={`${enlace} font-heading text-lg font-bold`}>
              {persona.nombre}
            </a>
          </div>
          <div className="py-1">
            <Navegacion actual={actual} etiqueta="Principal" />
          </div>
        </div>
      </header>

      <main
        id="contenido"
        tabIndex={-1}
        className="mx-auto w-full max-w-content flex-1 px-3 md:px-4"
      >
        <section id="inicio" aria-labelledby="titulo-inicio" className="py-16">
          <p className="text-text-muted">{persona.rol}</p>
          <h1 id="titulo-inicio" className="mt-1 text-4xl">
            Propuesta de valor en una frase clara
          </h1>
          <p className="mt-2 text-lg text-text-muted">
            Texto de prueba: qué haces y para quién. Aquí iría el resumen que hoy vive en Inicio.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <a href="#trabajos" className={botonPrimario}>
              Ver mis trabajos
            </a>
            <a href={`mailto:${persona.correo}`} className={botonSecundario}>
              Escríbeme
            </a>
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
            Tres casos de producto y el caso de este portafolio. En la versión real, cada tarjeta
            abre su propia página con el caso completo.
          </p>
          <ul className="mt-6 grid gap-4 md:grid-cols-3">
            {casos.map((caso) => (
              <li key={caso.id} className="border border-border bg-surface p-4">
                <h3 className="text-xl">{caso.titulo}</h3>
                <p className="mt-1 text-text-muted">{caso.linea}</p>
                <a
                  href="#trabajos"
                  className={`mt-2 inline-flex min-h-target items-center font-semibold ${enlaceTexto}`}
                >
                  Leer el caso
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-text-muted">
            Aparte:{" "}
            <a href="#trabajos" className={enlaceTexto}>
              Cómo hice este portafolio
            </a>
            .
          </p>
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
        </section>

        <section aria-labelledby="titulo-estados" className="border-t border-border py-16">
          <h2 id="titulo-estados" className="text-3xl">
            Estados de los botones (solo prototipo)
          </h2>
          <p className="mt-1 text-text-muted">
            Esta sección no existe en el sitio real. El foco de teclado se ve con Tab sobre los
            botones de Inicio: anillo Teal de 2px.
          </p>
          {[
            { nombre: "Primario", estados: estadosPrimario },
            { nombre: "Secundario", estados: estadosSecundario },
          ].map((grupo) => (
            <div key={grupo.nombre} className="mt-4">
              <h3 className="text-xl">{grupo.nombre}</h3>
              <ul className="mt-1 flex flex-wrap gap-2">
                {grupo.estados.map((item) => (
                  <li key={item.estado} className="flex flex-col gap-1">
                    <span className={`${botonBase} ${item.clases}`}>Escríbeme</span>
                    <span className="text-sm text-text-muted">{item.estado}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      </main>

      <footer className="border-t border-border bg-surface">
        <div className="mx-auto flex max-w-content flex-col gap-1 px-3 py-6 text-sm text-text-muted sm:flex-row sm:justify-between md:px-4">
          <p>
            Diseñado y construido por {persona.nombre}.{" "}
            <a href="#trabajos" className={enlaceTexto}>
              Cómo hice este portafolio
            </a>
          </p>
          <p>
            © {new Date().getFullYear()} {persona.nombre}
          </p>
        </div>
      </footer>
    </div>
  );
}
