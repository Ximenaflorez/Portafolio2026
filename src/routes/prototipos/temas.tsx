import { useEffect, useState, type ReactNode } from "react";
import { useSearchParams } from "react-router";
import { Button } from "~/components/atoms/Button";
import { NavLink } from "~/components/atoms/NavLink";
import { SkipLink } from "~/components/atoms/SkipLink";
import { TextLink } from "~/components/atoms/TextLink";
import { sections } from "~/lib/sections";
import { useActiveSection, useAnchorScrollBehavior } from "~/lib/use-active-section";

// Prototipo de aprobación T086: tema oscuro (propuesta) y encabezado con selector de idioma y
// botón de tema. Contenido de prueba. Solo en desarrollo; se borra al aprobarse.

const oscuro: Record<string, string> = {
  background: "12 10 9",
  surface: "28 25 23",
  text: "250 250 249",
  "text-muted": "168 162 158",
  primary: "165 180 252",
  "primary-hover": "199 210 254",
  "primary-active": "224 231 255",
  "on-primary": "30 27 75",
  focus: "34 211 238",
  error: "252 165 165",
  success: "134 239 172",
  border: "68 64 60",
  "border-strong": "120 113 108",
};

const claro: Record<string, string> = {
  background: "250 250 249",
  surface: "255 255 255",
  text: "28 25 23",
  "text-muted": "87 83 78",
  primary: "67 56 202",
  "primary-hover": "55 48 163",
  "primary-active": "49 46 129",
  "on-primary": "255 255 255",
  focus: "14 116 144",
  error: "185 28 28",
  success: "21 128 61",
  border: "214 211 209",
  "border-strong": "120 113 108",
};

const variablesOscuro = Object.entries(oscuro)
  .map(([nombre, canales]) => `--color-${nombre}: ${canales};`)
  .join(" ");

// Mismos selectores que fija contracts/tokens.md: elección con el botón, o sistema si no hay.
const css = `
:root { color-scheme: light dark; }
:root[data-theme="dark"] { ${variablesOscuro} }
@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) { ${variablesOscuro} } }
`;

function canal(valor: number) {
  const v = valor / 255;
  return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
}
function luminancia(rgb: string) {
  const [r, g, b] = rgb.split(" ").map(Number);
  return 0.2126 * canal(r) + 0.7152 * canal(g) + 0.0722 * canal(b);
}
function razon(a: string, b: string) {
  const [alta, baja] = [luminancia(a), luminancia(b)].sort((x, y) => y - x);
  return (alta + 0.05) / (baja + 0.05);
}

const parejas: Array<[string, string, number]> = [
  ["text", "background", 4.5],
  ["text", "surface", 4.5],
  ["text-muted", "background", 4.5],
  ["text-muted", "surface", 4.5],
  ["primary", "background", 4.5],
  ["primary", "surface", 4.5],
  ["error", "background", 4.5],
  ["error", "surface", 4.5],
  ["success", "background", 4.5],
  ["success", "surface", 4.5],
  ["on-primary", "primary", 4.5],
  ["on-primary", "primary-hover", 4.5],
  ["on-primary", "primary-active", 4.5],
  ["focus", "background", 3],
  ["focus", "surface", 3],
  ["border-strong", "background", 3],
  ["border-strong", "surface", 3],
];

type Idioma = "es" | "en";

const textos = {
  es: {
    skip: "Saltar al contenido",
    nav: "Principal",
    secciones: ["Inicio", "Trabajos", "Sobre mí", "Contacto"],
    idiomaDestino: "English",
    idiomaDestinoCodigo: "en",
    idiomaEtiqueta: "Cambiar a inglés",
    temaClaro: "Cambiar a modo claro",
    temaOscuro: "Cambiar a modo oscuro",
    rol: "Product Designer y UX Engineer",
    titulo: "Propuesta de valor en una frase clara",
    intro: "Texto de prueba: qué haces y para quién.",
    verTrabajos: "Ver mis trabajos",
    escribeme: "Escríbeme",
    trabajos: "Trabajos",
    tipo: "B2B SaaS",
    caso: "Rediseño del flujo de despacho en una plataforma logística B2B",
    rolCaso: "Product Designer líder",
    resultado: "Entre 20% y 30% menos abandono en el flujo de despacho.",
    leer: "Leer el caso",
    sobreMi: "Sobre mí",
    contacto: "Contacto",
    contrasteTitulo: "Contraste de la propuesta",
    contrasteIntro:
      "Razón de contraste de cada pareja de contracts/tokens.md en el tema claro (vigente) y en el oscuro (propuesta). Mínimos: 4.5:1 texto y 3:1 foco y bordes de control.",
    muestrario: "Colores de la propuesta (se ven en el tema activo)",
  },
  en: {
    skip: "Skip to content",
    nav: "Main",
    secciones: ["Home", "Work", "About", "Contact"],
    idiomaDestino: "Español",
    idiomaDestinoCodigo: "es",
    idiomaEtiqueta: "Switch to Spanish",
    temaClaro: "Switch to light mode",
    temaOscuro: "Switch to dark mode",
    rol: "Product Designer and UX Engineer",
    titulo: "A value proposition in one clear sentence",
    intro: "Test text: what you do and who you do it for.",
    verTrabajos: "See my work",
    escribeme: "Write to me",
    trabajos: "Work",
    tipo: "B2B SaaS",
    caso: "Redesign of the dispatch flow in a B2B logistics platform",
    rolCaso: "Lead Product Designer",
    resultado: "20% to 30% less drop-off in the dispatch flow.",
    leer: "Read the case",
    sobreMi: "About",
    contacto: "Contact",
    contrasteTitulo: "Contrast of the proposal",
    contrasteIntro:
      "Contrast ratio of each pair in contracts/tokens.md, light theme (current) and dark theme (proposal). Minimums: 4.5:1 text and 3:1 focus and control borders.",
    muestrario: "Proposal colors (shown in the active theme)",
  },
} as const;

function useTema() {
  const [oscuroActivo, setOscuroActivo] = useState(false);

  useEffect(() => {
    const guardado = window.localStorage.getItem("theme");
    const raiz = document.documentElement;
    if (guardado === "dark" || guardado === "light") raiz.dataset.theme = guardado;
    const sistema = window.matchMedia("(prefers-color-scheme: dark)");
    const calcular = () =>
      setOscuroActivo(raiz.dataset.theme ? raiz.dataset.theme === "dark" : sistema.matches);
    calcular();
    sistema.addEventListener("change", calcular);
    return () => {
      sistema.removeEventListener("change", calcular);
      delete raiz.dataset.theme;
    };
  }, []);

  function alternar() {
    const siguiente = oscuroActivo ? "light" : "dark";
    document.documentElement.dataset.theme = siguiente;
    window.localStorage.setItem("theme", siguiente);
    setOscuroActivo(!oscuroActivo);
  }

  return { oscuroActivo, alternar };
}

function IconoTema({ oscuroActivo }: { oscuroActivo: boolean }) {
  // Muestra la acción: sol para pasar a claro, luna para pasar a oscuro.
  return oscuroActivo ? (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  ) : (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
    </svg>
  );
}

function Controles({
  idioma,
  hrefIdioma,
  oscuroActivo,
  alternar,
  className = "",
}: {
  idioma: Idioma;
  hrefIdioma: string;
  oscuroActivo: boolean;
  alternar: () => void;
  className?: string;
}) {
  const t = textos[idioma];
  return (
    <div className={`items-center gap-x-1 ${className}`}>
      <a
        href={hrefIdioma}
        hrefLang={t.idiomaDestinoCodigo}
        lang={t.idiomaDestinoCodigo}
        aria-label={t.idiomaEtiqueta}
        className="inline-flex min-h-target min-w-target items-center justify-center px-1 font-semibold text-text transition-colors duration-state hover:text-primary-hover active:text-primary-active"
      >
        {t.idiomaDestino}
      </a>
      <button
        type="button"
        aria-pressed={oscuroActivo}
        aria-label={oscuroActivo ? t.temaClaro : t.temaOscuro}
        onClick={alternar}
        className="inline-flex min-h-target min-w-target items-center justify-center border border-border-strong text-text transition-colors duration-state hover:text-primary-hover active:text-primary-active"
      >
        <IconoTema oscuroActivo={oscuroActivo} />
      </button>
    </div>
  );
}

function Seccion({ id, children }: { id: string; children: ReactNode }) {
  return (
    <section
      id={id}
      aria-labelledby={`t-${id}`}
      className="border-t border-border py-16 first:border-t-0"
    >
      {children}
    </section>
  );
}

export function meta() {
  return [{ title: "Prototipo: temas e idiomas" }, { name: "robots", content: "noindex" }];
}

export default function PrototipoTemas() {
  const [params] = useSearchParams();
  const idioma: Idioma = params.get("lang") === "en" ? "en" : "es";
  const telefono = params.get("telefono") === "b" ? "b" : "a";
  const t = textos[idioma];
  const actual = useActiveSection(true);
  useAnchorScrollBehavior();
  const { oscuroActivo, alternar } = useTema();

  const base = `/prototipos/temas?lang=${idioma}&telefono=${telefono}`;
  const otroIdioma = idioma === "es" ? "en" : "es";
  const hrefIdioma = `/prototipos/temas?lang=${otroIdioma}&telefono=${telefono}`;

  return (
    <div className="flex min-h-screen flex-col bg-background text-text">
      <style>{css}</style>

      <nav
        aria-label="Variante del prototipo"
        className="border-b border-dashed border-border-strong bg-surface"
      >
        <ul className="mx-auto flex max-w-content flex-wrap items-center gap-x-3 px-3 md:px-4">
          <li className="text-sm text-text-muted">Solo prototipo, en teléfono:</li>
          <li>
            <TextLink to={`/prototipos/temas?lang=${idioma}&telefono=a`} variant="standalone">
              A: controles en la fila que se desplaza
            </TextLink>
          </li>
          <li>
            <TextLink to={`/prototipos/temas?lang=${idioma}&telefono=b`} variant="standalone">
              B: controles en la fila fija
            </TextLink>
          </li>
        </ul>
      </nav>

      <SkipLink />

      <header className="sticky top-header-collapse z-10 border-b border-border bg-background sm:top-0">
        <div className="mx-auto flex max-w-content flex-col px-3 sm:flex-row sm:items-center sm:justify-between md:px-4">
          <div className="flex items-center justify-between pt-1 sm:py-1">
            <TextLink
              to={`${base}#inicio`}
              variant="standalone"
              className="font-heading text-lg font-bold"
            >
              Nombre Apellido
            </TextLink>
            {telefono === "a" && (
              <Controles
                idioma={idioma}
                hrefIdioma={hrefIdioma}
                oscuroActivo={oscuroActivo}
                alternar={alternar}
                className="flex sm:hidden"
              />
            )}
          </div>
          <div className="flex flex-wrap items-center justify-between gap-x-2 py-1">
            <nav aria-label={t.nav}>
              <ul className="flex flex-wrap gap-x-2">
                {sections.map((seccion, indice) => (
                  <li key={seccion.id}>
                    <NavLink to={`${base}#${seccion.id}`} current={seccion.id === actual}>
                      {t.secciones[indice]}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>
            <Controles
              idioma={idioma}
              hrefIdioma={hrefIdioma}
              oscuroActivo={oscuroActivo}
              alternar={alternar}
              className={telefono === "a" ? "hidden sm:flex" : "flex"}
            />
          </div>
        </div>
      </header>

      <main
        id="contenido"
        tabIndex={-1}
        className="mx-auto w-full max-w-content flex-1 px-3 focus:outline-none md:px-4"
      >
        <Seccion id="inicio">
          <p className="text-text-muted">{t.rol}</p>
          <h1 id="t-inicio" className="mt-1 text-4xl">
            {t.titulo}
          </h1>
          <p className="mt-2 text-lg text-text-muted">{t.intro}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button variant="primary" to={`${base}#trabajos`}>
              {t.verTrabajos}
            </Button>
            <Button variant="secondary" href="mailto:nombre@ejemplo.com">
              {t.escribeme}
            </Button>
          </div>
        </Seccion>

        <Seccion id="trabajos">
          <h2 id="t-trabajos" className="text-3xl">
            {t.trabajos}
          </h2>
          <div className="mt-6 flex max-w-prose flex-col border border-border bg-surface p-4">
            <p className="text-sm text-text-muted">{t.tipo}</p>
            <h3 className="mt-0.5 text-xl">{t.caso}</h3>
            <p className="mt-1 text-sm text-text-muted">{t.rolCaso}</p>
            <p className="mt-2">{t.resultado}</p>
            <div className="mt-2">
              <TextLink to={`${base}#trabajos`} variant="standalone" className="font-semibold">
                {t.leer}
              </TextLink>
            </div>
          </div>
          <p className="mt-4">
            <span className="text-error">Error de ejemplo</span> ·{" "}
            <span className="text-success">Éxito de ejemplo</span> ·{" "}
            <TextLink href="#trabajos">enlace dentro de un párrafo</TextLink>
          </p>
        </Seccion>

        <Seccion id="sobre-mi">
          <h2 id="t-sobre-mi" className="text-3xl">
            {t.sobreMi}
          </h2>
          <h3 className="mt-4 text-xl">{t.contrasteTitulo}</h3>
          <p className="mt-1 max-w-prose text-text-muted">{t.contrasteIntro}</p>
          <div className="mt-2 overflow-x-auto">
            <table className="w-full border border-border text-left text-sm">
              <caption className="sr-only">{t.contrasteTitulo}</caption>
              <thead className="bg-surface">
                <tr>
                  <th scope="col" className="p-1">
                    Primer plano
                  </th>
                  <th scope="col" className="p-1">
                    Fondo
                  </th>
                  <th scope="col" className="p-1">
                    Mínimo
                  </th>
                  <th scope="col" className="p-1">
                    Claro
                  </th>
                  <th scope="col" className="p-1">
                    Oscuro
                  </th>
                </tr>
              </thead>
              <tbody>
                {parejas.map(([primero, fondo, minimo]) => {
                  const rc = razon(claro[primero], claro[fondo]);
                  const ro = razon(oscuro[primero], oscuro[fondo]);
                  return (
                    <tr key={`${primero}-${fondo}`} className="border-t border-border">
                      <th scope="row" className="p-1 font-normal">
                        {primero}
                      </th>
                      <td className="p-1">{fondo}</td>
                      <td className="p-1">{minimo}:1</td>
                      <td className="p-1">
                        {rc.toFixed(1)}:1 {rc >= minimo ? "✓" : "✗"}
                      </td>
                      <td className="p-1">
                        {ro.toFixed(1)}:1 {ro >= minimo ? "✓" : "✗"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Seccion>

        <Seccion id="contacto">
          <h2 id="t-contacto" className="text-3xl">
            {t.contacto}
          </h2>
          <h3 className="mt-4 text-xl">{t.muestrario}</h3>
          <ul className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {Object.keys(oscuro).map((nombre) => (
              <li key={nombre} className="flex items-center gap-2 text-sm">
                <span
                  aria-hidden="true"
                  className="inline-block h-5 w-5 shrink-0 border border-border-strong"
                  style={{ backgroundColor: `rgb(var(--color-${nombre}))` }}
                />
                {nombre}
              </li>
            ))}
          </ul>
        </Seccion>
      </main>

      <footer className="border-t border-border bg-surface">
        <p className="mx-auto max-w-content px-3 py-6 text-sm text-text-muted md:px-4">
          © 2026 Nombre Apellido
        </p>
      </footer>
    </div>
  );
}
