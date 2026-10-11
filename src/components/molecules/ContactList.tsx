import { TextLink } from "../atoms/TextLink";

type Props = {
  email: string;
  linkedin: string;
  /** Ruta o URL del CV; sin ella (el archivo falta) no se muestra su enlace. */
  cv?: string;
  label: string;
  cvLabel: string;
  className?: string;
};

// Solo enlaces, sin formulario (FR-034).
export function ContactList({ email, linkedin, cv, label, cvLabel, className = "" }: Props) {
  return (
    <ul className={className || undefined} aria-label={label}>
      <li>
        <TextLink variant="standalone" href={`mailto:${email}`}>
          {email}
        </TextLink>
      </li>
      <li>
        <TextLink variant="standalone" href={linkedin}>
          LinkedIn
        </TextLink>
      </li>
      {cv && (
        <li>
          <TextLink variant="standalone" href={cv} download>
            {cvLabel}
          </TextLink>
        </li>
      )}
    </ul>
  );
}
