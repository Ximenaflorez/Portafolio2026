import { Link } from "react-router";
import { publicUrl } from "~/lib/public-url";
import { CaseLinks } from "./CaseLinks";

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
  /** Pantalla publicada del caso, si existe. */
  screen?: { href: string; label: string };
  /** Markdown que fundaron el caso, si existen. */
  spec?: { href: string; label: string };
  /** Imagen del caso; sin ella se usa una genérica y decorativa. */
  image?: { src: string; alt: string };
};

const genericImage = { src: "/casos/generica.svg", alt: "" };

const chip = "self-start rounded-chip border border-border bg-surface px-1 py-0.5 text-sm";

// Tarjeta de caso destacado: superficie plana, imagen a sangre. En teléfono la foto va abajo
// del texto; desde `sm`, a la derecha. Ocupa el ancho de Trabajos: una sola columna de filas.
export function CaseCard({
  to,
  title,
  sector,
  sectorLabel,
  tags = [],
  role,
  description,
  screen,
  spec,
  image = genericImage,
}: Props) {
  return (
    <li className="card-lift flex flex-col overflow-hidden rounded-card bg-surface sm:flex-row">
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
        <h3 className="mt-2 text-2xl">
          <Link to={to} className="card-hit">
            {title}
          </Link>
        </h3>
        {role && <p className="mt-1 text-sm text-text-muted">{role}</p>}
        <p className="mt-4">{description}</p>
        <CaseLinks screen={screen} spec={spec} className="card-actions mt-6 flex flex-col gap-2" />
      </div>
      <div className="card-media sm:w-1/2 sm:shrink-0">
        <img
          src={publicUrl(image.src)}
          alt={image.alt}
          className="aspect-video h-full w-full object-cover sm:aspect-auto"
        />
      </div>
    </li>
  );
}
