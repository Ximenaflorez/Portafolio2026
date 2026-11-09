import { publicUrl } from "~/lib/public-url";
import { Button } from "../atoms/Button";

type Props = {
  /** Tres líneas del h1: saludo, acento y contexto. */
  title: [string, string, string];
  valueProposition: string;
  email: string;
  /** Ancla de la sección Trabajos en el idioma de la página. */
  workHref: string;
  /** `id` del h1, que da nombre a la sección Inicio. */
  headingId: string;
  photo: { src: string; alt: string };
  labels: { work: string; contact: string };
  /** Cifras del Inicio aprobadas en T066: años, casos publicados y resultado. */
  stats?: { value: string; label: string }[];
};

const photoClass =
  "aspect-square w-16 shrink-0 rounded-image border-photo border-primary object-cover";

// Inicio: foto, nombre, rol, propuesta y acciones, en columna.
export function ProfileIntro({
  title,
  valueProposition,
  email,
  workHref,
  headingId,
  photo,
  labels,
  stats = [],
}: Props) {
  return (
    <div className="py-12">
      <div>
        <img
          src={publicUrl(photo.src)}
          alt={photo.alt}
          width={128}
          height={128}
          className={photoClass}
        />
        <div className="hero mt-4">
          <h1 id={headingId} className="hero-title" aria-label={title.join(" ")}>
            <span>{title[0]}</span>
            <span className="line-2-italic">{title[1]}</span>
            <span>{title[2]}</span>
          </h1>
          <p className="hero-subtext">{valueProposition}</p>
        </div>
        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          <Button variant="primary" to={workHref}>
            {labels.work}
          </Button>
          <Button variant="secondary" href={`mailto:${email}`}>
            {labels.contact}
          </Button>
        </div>
      </div>
      {stats.length > 0 ? (
        <ul className="mt-8 grid gap-4 sm:grid-cols-3">
          {stats.map((item) => (
            <li key={item.label}>
              <p className="font-heading text-3xl">{item.value}</p>
              <p className="mt-1 text-text-muted">{item.label}</p>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
