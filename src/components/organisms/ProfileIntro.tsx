import { publicUrl } from "~/lib/public-url";
import { Button } from "../atoms/Button";
import { Heading } from "../atoms/Heading";
import { Text } from "../atoms/Text";

type Props = {
  name: string;
  role: string;
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

// Inicio (FR-018, aprobado en T066): la foto va arriba del titular, a la izquierda; debajo, el
// nombre como único h1, el rol, la propuesta de valor y los dos botones.
export function ProfileIntro({
  name,
  role,
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
      <img
        src={publicUrl(photo.src)}
        alt={photo.alt}
        width={128}
        height={128}
        className="aspect-square w-16 rounded-photo border-photo border-primary object-cover"
      />
      <Heading level={1} size="4xl" id={headingId} className="mt-4">
        {name}
      </Heading>
      <Text size="lg" tone="muted" className="mt-1">
        {role}
      </Text>
      <Text size="lg" className="mt-4 max-w-prose">
        {valueProposition}
      </Text>
      <div className="mt-6 flex flex-col gap-2 sm:flex-row">
        <Button variant="primary" to={workHref}>
          {labels.work}
        </Button>
        <Button variant="secondary" href={`mailto:${email}`}>
          {labels.contact}
        </Button>
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
