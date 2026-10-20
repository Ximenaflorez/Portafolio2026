import { publicUrl } from "~/lib/public-url";
import { TextLink } from "../atoms/TextLink";

type Props = {
  to: string;
  title: string;
  /** Rubro del caso (Fintech, ATS…): se muestra como chip de solo lectura. */
  sector: string;
  /** Texto que anuncia la tecnología de apoyo antes del rubro, p. ej. «Rubro». */
  sectorLabel: string;
  /** Chips junto al rubro, p. ej. «Investigación». */
  tags?: string[];
  role?: string;
  /** Línea de resultado del caso, o su descripción en el caso meta. */
  description: string;
  readLabel: string;
  /** Imagen del caso; sin ella se usa una genérica y decorativa. */
  image?: { src: string; alt: string };
};

const genericImage = { src: "/casos/generica.svg", alt: "" };

const chip = "self-start rounded-chip border border-border bg-surface px-1 py-0.5 text-sm";

function CheckIcon() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="mt-0.5 h-3 w-3 shrink-0 text-success"
    >
      <path d="M5 12l5 5L20 7" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-3 w-3 shrink-0"
    >
      <path d="M7 17L17 7M10 7h7v7" />
    </svg>
  );
}

// Tarjeta tonal al estilo Material (aprobada el 2026-10-09): la imagen sangra hasta los bordes y
// la tarjeta la recorta con su esquina. En teléfono va abajo del texto; desde `sm`, a la derecha.
// Ocupa el ancho de Trabajos: una sola columna de filas.
export function CaseCard({
  to,
  title,
  sector,
  sectorLabel,
  tags = [],
  role,
  description,
  readLabel,
  image = genericImage,
}: Props) {
  return (
    <li className="flex flex-col overflow-hidden rounded-card border border-border bg-surface-tonal sm:flex-row">
      <div className="flex flex-1 flex-col justify-center p-6 sm:max-w-[50%] sm:p-8">
        <div className="flex flex-wrap gap-1">
          <p className={chip}>
            <span className="sr-only">{sectorLabel}: </span>
            {sector}
          </p>
          {tags.map((tag) => (
            <p key={tag} className={chip}>
              {tag}
            </p>
          ))}
        </div>
        <h3 className="mt-2 text-2xl">{title}</h3>
        {role && <p className="mt-1 text-sm text-text-muted">{role}</p>}
        <p className="mt-4 flex gap-2">
          <CheckIcon />
          <span>{description}</span>
        </p>
        <div className="mt-6">
          <TextLink to={to} variant="standalone" className="gap-2 font-semibold">
            {readLabel}
            <ArrowIcon />
            <span className="sr-only">: {title}</span>
          </TextLink>
        </div>
      </div>
      <img
        src={publicUrl(image.src)}
        alt={image.alt}
        className="aspect-video w-full object-cover sm:w-1/2 sm:shrink-0 sm:self-stretch sm:aspect-auto"
      />
    </li>
  );
}
