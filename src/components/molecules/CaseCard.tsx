import { TextLink } from "../atoms/TextLink";

type Props = {
  to: string;
  title: string;
  /** Rubro del caso (Fintech, ATS…): se muestra como chip de solo lectura. */
  sector: string;
  /** Texto que anuncia la tecnología de apoyo antes del rubro, p. ej. «Rubro». */
  sectorLabel: string;
  role?: string;
  /** Línea de resultado del caso, o su descripción en el caso meta. */
  description: string;
  readLabel: string;
  /** Imagen del caso; sin ella se usa una genérica y decorativa. */
  image?: { src: string; alt: string };
};

const genericImage = { src: "/casos/generica.svg", alt: "" };

// Tarjeta tonal al estilo Material (aprobada el 2026-10-09): la imagen sangra hasta los bordes y
// la tarjeta la recorta con su esquina; debajo van el chip del rubro, el título y el enlace.
export function CaseCard({
  to,
  title,
  sector,
  sectorLabel,
  role,
  description,
  readLabel,
  image = genericImage,
}: Props) {
  return (
    <li className="flex flex-col overflow-hidden rounded-card border border-border bg-surface-tonal">
      <img src={image.src} alt={image.alt} className="aspect-video w-full object-cover" />
      <div className="flex flex-1 flex-col p-4">
        <p className="self-start rounded-chip border border-border bg-surface px-1 py-0.5 text-sm">
          <span className="sr-only">{sectorLabel}: </span>
          {sector}
        </p>
        <h3 className="mt-2 text-xl">{title}</h3>
        {role && <p className="mt-1 text-sm text-text-muted">{role}</p>}
        <p className="mt-2 flex-1">{description}</p>
        <div className="mt-2">
          <TextLink to={to} variant="standalone" className="font-semibold">
            {readLabel}
            <span className="sr-only">: {title}</span>
          </TextLink>
        </div>
      </div>
    </li>
  );
}
